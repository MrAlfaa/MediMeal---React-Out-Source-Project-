import React from 'react';
import { Link } from 'react-router-dom';

interface NutritionFact {
  id: string;
  title: string;
  description: string;
}

interface DietaryGuide {
  id: string;
  condition: string;
  recommendations: string[];
  avoidItems: string[];
}

const DietaryInfo: React.FC = () => {
  const nutritionFacts: NutritionFact[] = [
    {
      id: '1',
      title: 'Balanced Nutrition',
      description: 'A balanced diet includes a variety of foods from all food groups to provide essential nutrients for health and well-being.'
    },
    {
      id: '2',
      title: 'Hydration',
      description: 'Staying hydrated is crucial for recovery. Aim to drink at least 8 glasses of water daily unless otherwise instructed by your healthcare provider.'
    },
    {
      id: '3',
      title: 'Protein Intake',
      description: 'Protein is essential for tissue repair and immune function. Good sources include lean meats, fish, eggs, dairy, legumes, and nuts.'
    },
    {
      id: '4',
      title: 'Fiber Benefits',
      description: 'Dietary fiber promotes digestive health and can help prevent constipation, which is common during hospital stays.'
    },
    {
      id: '5',
      title: 'Vitamin C',
      description: 'Vitamin C supports wound healing and immune function. Citrus fruits, strawberries, bell peppers, and broccoli are excellent sources.'
    }
  ];

  const dietaryGuides: DietaryGuide[] = [
    {
      id: '1',
      condition: 'Diabetes',
      recommendations: [
        'Focus on low glycemic index foods',
        'Include lean proteins with each meal',
        'Choose whole grains over refined carbohydrates',
        'Incorporate healthy fats like avocados and olive oil'
      ],
      avoidItems: [
        'Sugary beverages and desserts',
        'Refined carbohydrates like white bread',
        'Processed foods high in added sugars',
        'Large portions of starchy vegetables'
      ]
    },
    {
      id: '2',
      condition: 'Heart Disease',
      recommendations: [
        'Choose foods low in saturated and trans fats',
        'Increase intake of omega-3 fatty acids from fish',
        'Consume plenty of fruits, vegetables, and whole grains',
        'Select lean protein sources'
      ],
      avoidItems: [
        'High-sodium foods',
        'Processed meats',
        'Full-fat dairy products',
        'Fried foods'
      ]
    },
    {
      id: '3',
      condition: 'Kidney Disease',
      recommendations: [
        'Monitor protein intake as advised by your doctor',
        'Choose lower potassium fruits and vegetables if needed',
        'Control portion sizes',
        'Stay hydrated within fluid restrictions'
      ],
      avoidItems: [
        'High-phosphorus foods if restricted',
        'High-potassium foods if restricted',
        'Excessive salt',
        'Processed foods with phosphate additives'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with back navigation */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link to="/" className="flex-shrink-0 flex items-center">
                <svg className="h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span className="ml-2 text-xl font-bold text-gray-900">Dietary Information</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Nutrition Facts</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Important information about nutrition during your hospital stay.
              </p>
            </div>
            <div className="border-t border-gray-200">
              <dl>
                {nutritionFacts.map((fact, index) => (
                  <div key={fact.id} className={index % 2 === 0 ? 'bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6' : 'bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'}>
                    <dt className="text-sm font-medium text-gray-500">{fact.title}</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{fact.description}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Dietary Guidelines by Condition</h3>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {dietaryGuides.map((guide) => (
                <div key={guide.id} className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">{guide.condition}</h4>
                    
                    <div className="mb-4">
                      <h5 className="text-sm font-medium text-gray-700 mb-2">Recommended Foods:</h5>
                      <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
                        {guide.recommendations.map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-2">Foods to Avoid:</h5>
                      <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
                        {guide.avoidItems.map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Consult with a Dietitian</h3>
              <p className="text-sm text-gray-500 mb-4">
                For personalized dietary advice based on your specific health needs, consider scheduling a consultation with our hospital dietitian.
              </p>
              <button
                type="button"
                onClick={() => alert('Dietitian consultation request would be implemented here')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Request Dietitian Consultation
              </button>
            </div>
          </div>

          <div className="mt-6 flex justify-center">
            <Link
              to="/"
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DietaryInfo;
