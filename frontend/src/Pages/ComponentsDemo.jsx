import React, { useState } from 'react';
import {
  Badge,
  Button,
  Card,
  Input,
  Modal,
  Select
} from '../Components';

const ComponentsDemo = () => {
  // State for form inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [carType, setCarType] = useState('');
  
  // State for modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Car type options
  const carTypeOptions = [
    { value: 'sedan', label: 'Sedan' },
    { value: 'suv', label: 'SUV' },
    { value: 'luxury', label: 'Luxury' },
    { value: 'sports', label: 'Sports Car' },
  ];
  
  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8">Components Demo</h1>
      
      {/* Buttons Section */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Buttons</h2>
        <div className="flex flex-wrap gap-4">
          <Button variant="primary">Primary Button</Button>
          <Button variant="secondary">Secondary Button</Button>
          <Button variant="outline">Outline Button</Button>
          <Button variant="text">Text Button</Button>
          <Button variant="primary" size="sm">Small Button</Button>
          <Button variant="primary" size="lg">Large Button</Button>
          <Button variant="primary" disabled>Disabled Button</Button>
        </div>
      </section>
      
      {/* Badges Section */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Badges</h2>
        <div className="flex flex-wrap gap-4">
          <Badge variant="default">Default</Badge>
          <Badge variant="primary">Primary</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="error">Error</Badge>
          <Badge variant="info">Info</Badge>
          <Badge variant="success" rounded>Available</Badge>
          <Badge variant="error" rounded>Booked</Badge>
        </div>
      </section>
      
      {/* Cards Section */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Cards</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <h3 className="text-xl font-semibold mb-2">Basic Card</h3>
            <p>This is a basic card with default styling.</p>
          </Card>
          
          <Card hoverable>
            <h3 className="text-xl font-semibold mb-2">Hoverable Card</h3>
            <p>This card has a hover effect. Try hovering over it!</p>
          </Card>
          
          <Card bordered={false} className="bg-gray-100">
            <h3 className="text-xl font-semibold mb-2">Borderless Card</h3>
            <p>This card has no border but a different background color.</p>
          </Card>
        </div>
      </section>
      
      {/* Form Elements Section */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Form Elements</h2>
        <Card className="max-w-md mx-auto">
          <h3 className="text-xl font-semibold mb-4">Login Form</h3>
          
          <div className="space-y-4">
            <Input
              type="email"
              label="Email Address"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            
            <Input
              type="password"
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            
            <Select
              label="Car Type"
              options={carTypeOptions}
              value={carType}
              onChange={(e) => setCarType(e.target.value)}
              placeholder="Select a car type"
            />
            
            <Button variant="primary" fullWidth>
              Login
            </Button>
          </div>
        </Card>
      </section>
      
      {/* Modal Section */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Modal</h2>
        <Button variant="primary" onClick={() => setIsModalOpen(true)}>
          Open Modal
        </Button>
        
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Booking Confirmation"
        >
          <div className="space-y-4">
            <p>Your car booking has been confirmed!</p>
            <div className="flex justify-end">
              <Button variant="primary" onClick={() => setIsModalOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      </section>
    </div>
  );
};

export default ComponentsDemo;