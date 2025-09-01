// import Car from '../models/Car.js';

// // GET /api/gemini/carDetails
// // Supports: ?id=CAR_ID (single) OR list with filters & pagination
// export const getInfo = async (req, res) => {
//   try {
//     const {
//       id,
//       brand,
//       model,
//       location,
//       category,
//       fuel_type,
//       transmission,
//       minPrice,
//       maxPrice,
//       seats,
//       available,
//       page = 1,
//       limit = 10,
//       sort = '-createdAt'
//     } = req.query;

//     // Single car by id
//     if (id) {
//       const car = await Car.findById(id);
//       if (!car) return res.status(404).json({ success: false, message: 'Car not found' });
//       return res.json({ success: true, data: car });
//     }

//     // Build filters
//     const filters = {};
//     if (brand) filters.brand = new RegExp(`^${brand}$`, 'i');
//     if (model) filters.model = new RegExp(model, 'i');
//     if (location) filters.location = new RegExp(location, 'i');
//     if (category) filters.category = new RegExp(`^${category}$`, 'i');
//     if (fuel_type) filters.fuel_type = new RegExp(`^${fuel_type}$`, 'i');
//     if (transmission) filters.transmission = new RegExp(`^${transmission}$`, 'i');
//     if (seats) filters.seating_capacity = Number(seats);
//     if (available !== undefined) filters.isAvailable = available === 'true';
//     if (minPrice || maxPrice) {
//       filters.pricePerDay = {};
//       if (minPrice) filters.pricePerDay.$gte = Number(minPrice);
//       if (maxPrice) filters.pricePerDay.$lte = Number(maxPrice);
//     }

//     const pageNum = Math.max(1, Number(page));
//     const limitNum = Math.min(50, Math.max(1, Number(limit)));
//     const skip = (pageNum - 1) * limitNum;

//     const [items, total] = await Promise.all([
//       Car.find(filters)
//         .sort(sort)
//         .skip(skip)
//         .limit(limitNum),
//       Car.countDocuments(filters)
//     ]);

//     return res.json({
//       success: true,
//       data: items,
//       meta: {
//         page: pageNum,
//         limit: limitNum,
//         total,
//         pages: Math.ceil(total / limitNum)
//       }
//     });
//   } catch (error) {
//     console.error('carDetails error:', error);
//     return res.status(500).json({ success: false, message: 'Failed to fetch car details', error: error.message });
//   }
// };

// export default { getInfo };





import mongoose from 'mongoose';
import Car from '../models/Car.js';
import { getGeminiClient } from '../config/gemini.js';

// Safely escape user input for regex
const escapeRegExp = (s = '') => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const parseBool = (v) => {
  if (v === undefined) return undefined;
  if (typeof v === 'boolean') return v;
  const s = String(v).toLowerCase();
  if (s === 'true') return true;
  if (s === 'false') return false;
  return undefined;
};

const parseNum = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
};

const getSafeSort = (sortParam, fallback = '-createdAt') => {
  if (!sortParam) return fallback;
  const allowed = new Set(['createdAt', 'pricePerDay', 'brand', 'model']);
  const desc = sortParam.startsWith('-');
  const field = desc ? sortParam.slice(1) : sortParam;
  if (!allowed.has(field)) return fallback;
  return desc ? `-${field}` : field;
};

export const getInfo = async (req, res) => {
  try {
    const {
      id,
      brand,
      model,
      location,
      category,
      fuel_type,
      transmission,
      minPrice,
      maxPrice,
      seats,
      available,
      page = 1,
      limit = 10,
      sort = '-createdAt',
    } = req.query;

    // Single car by id
    if (id) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: 'Invalid car id' });
      }
      const car = await Car.findById(id);
      if (!car) return res.status(404).json({ success: false, message: 'Car not found' });
      return res.json({ success: true, data: car });
    }

    // Build filters safely
    const filters = {};
    if (brand) filters.brand = new RegExp(`^${escapeRegExp(brand)}$`, 'i');
    if (model) filters.model = new RegExp(escapeRegExp(model), 'i');
    if (location) filters.location = new RegExp(escapeRegExp(location), 'i');
    if (category) filters.category = new RegExp(`^${escapeRegExp(category)}$`, 'i');
    if (fuel_type) filters.fuel_type = new RegExp(`^${escapeRegExp(fuel_type)}$`, 'i');
    if (transmission) filters.transmission = new RegExp(`^${escapeRegExp(transmission)}$`, 'i');

    const seatsNum = parseNum(seats);
    if (seatsNum !== undefined) filters.seating_capacity = seatsNum;

    const availBool = parseBool(available);
    if (availBool !== undefined) filters.isAvailable = availBool;

    const min = parseNum(minPrice);
    const max = parseNum(maxPrice);
    if (min !== undefined || max !== undefined) {
      filters.pricePerDay = {};
      if (min !== undefined) filters.pricePerDay.$gte = min;
      if (max !== undefined) filters.pricePerDay.$lte = max;
    }

    const pageNum = Math.max(1, Number(page) || 1);
    const limitNum = Math.min(50, Math.max(1, Number(limit) || 10));
    const skip = (pageNum - 1) * limitNum;

    const safeSort = getSafeSort(sort, '-createdAt');

    const [items, total] = await Promise.all([
      Car.find(filters).sort(safeSort).skip(skip).limit(limitNum),
      Car.countDocuments(filters),
    ]);

    return res.json({
      success: true,
      data: items,
      meta: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error('carDetails error:', error);
    return res
      .status(500)
      .json({ success: false, message: 'Failed to fetch car details', error: error.message });
  }
};

// Optional: actual Gemini endpoint (so /api/gemini truly uses Gemini)
export const askGemini = async (req, res) => {
  try {
    const { prompt } = req.body || {};
    if (!prompt || !prompt.trim()) {
      return res.status(400).json({ success: false, message: 'Prompt is required' });
    }
    const client = getGeminiClient();
    const text = await client.generateText(prompt);
    return res.json({ success: true, data: { text } });
  } catch (error) {
    console.error('askGemini error:', error);
    return res.status(500).json({ success: false, message: 'Gemini request failed', error: error.message });
  }
};



