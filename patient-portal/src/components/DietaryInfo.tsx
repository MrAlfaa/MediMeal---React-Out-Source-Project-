import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navigation from './Navigation';

interface NutritionFact {
  id: string;
  title: string;
  description: string;
  icon: string;
}

interface DietaryGuide {
  id: string;
  condition: string;
  recommendations: string[];
  avoidItems: string[];
  color: string;
}

const DietaryInfo: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'facts' | 'guides' | 'tips'>('facts');

  const nutritionFacts: NutritionFact[] = [
    {
      id: '1',
      title: 'Balanced Nutrition',
      description: 'A balanced diet includes a variety of foods from all food groups to provide essential nutrients for health and well-being.',
      icon: 'balance'
    },
    {
      id: '2',
      title: 'Hydration',
      description: 'Staying hydrated is crucial for recovery. Aim to drink at least 8 glasses of water daily unless otherwise instructed by your healthcare provider.',
      icon: 'water'
    },
    {
      id: '3',
      title: 'Protein Intake',
      description: 'Protein is essential for tissue repair and immune function. Good sources include lean meats, fish, eggs, dairy, legumes, and nuts.',
      icon: 'protein'
    },
    {
      id: '4',
      title: 'Fiber Benefits',
      description: 'Dietary fiber promotes digestive health and can help prevent constipation, which is common during hospital stays.',
      icon: 'fiber'
    },
    {
      id: '5',
      title: 'Vitamin C',
      description: 'Vitamin C supports wound healing and immune function. Citrus fruits, strawberries, bell peppers, and broccoli are excellent sources.',
      icon: 'vitamin'
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
      ],
      color: 'blue'
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
      ],
      color: 'red'
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
      ],
      color: 'green'
    }
  ];

  const healthTips = [
    {
      id: '1',
      title: 'Meal Timing',
      description: 'Eat regular meals to maintain stable blood sugar levels and support your body\'s healing process.',
      icon: 'clock'
    },
    {
      id: '2',
      title: 'Portion Control',
      description: 'Listen to your body\'s hunger cues and eat appropriate portions to avoid discomfort during recovery.',
      icon: 'portion'
    },
    {
      id: '3',
      title: 'Food Safety',
      description: 'During recovery, your immune system may be compromised. Choose freshly prepared, properly stored foods.',
      icon: 'safety'
    }
  ];

  const renderIcon = (iconName: string, className: string = "h-6 w-6") => {
    const icons = {
      balance: (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
        </svg>
      ),
      water: (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      ),
      protein: (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      fiber: (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      vitamin: (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      clock: (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      portion: (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
        </svg>
      ),
      safety: (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    };
    return icons[iconName as keyof typeof icons] || icons.balance;
  };

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: 'border-blue-200 bg-blue-50',
      red: 'border-red-200 bg-red-50',
      green: 'border-green-200 bg-green-50'
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Dietary Information & Nutrition</h1>
            <p className="mt-2 text-lg text-gray-600">
              Everything you need to know about nutrition during your hospital stay
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="border-b border-gray-200 mb-8">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('facts')}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === 'facts'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Nutrition Facts
              </button>
              <button
                onClick={() => setActiveTab('guides')}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === 'guides'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Condition-Specific Guides
              </button>
              <button
                onClick={() => setActiveTab('tips')}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === 'tips'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Health Tips
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="transition-all duration-300 ease-in-out">
            {activeTab === 'facts' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Essential Nutrition Facts</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {nutritionFacts.map((fact) => (
                    <div key={fact.id} className="bg-white rounded-xl shadow-md p-6 border border-gray-200 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                            {renderIcon(fact.icon)}
                          </div>
                        </div>
                        <div className="ml-4">
                          <h3 className="text-lg font-medium text-gray-900">{fact.title}</h3>
                          <p className="mt-2 text-gray-600">{fact.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'guides' && (
              <div className="space-y-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Dietary Guidelines by Medical Condition</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {dietaryGuides.map((guide) => (
                    <div key={guide.id} className={`bg-white rounded-xl shadow-md overflow-hidden border-2 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${getColorClasses(guide.color)}`}>
                      <div className="p-6">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">{guide.condition}</h3>
                        
                        <div className="mb-6">
                          <h4 className="text-sm font-medium text-green-800 mb-3 flex items-center">
                            <svg className="h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Recommended Foods:
                          </h4>
                          <ul className="space-y-2">
                            {guide.recommendations.map((item, idx) => (
                              <li key={idx} className="text-sm text-gray-700 flex items-start">
                                <span className="w-2 h-2 bg-green-400 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium text-red-800 mb-3 flex items-center">
                            <svg className="h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Foods to Avoid:
                          </h4>
                          <ul className="space-y-2">
                            {guide.avoidItems.map((item, idx) => (
                              <li key={idx} className="text-sm text-gray-700 flex items-start">
                                <span className="w-2 h-2 bg-red-400 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'tips' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Health & Recovery Tips</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {healthTips.map((tip) => (
                    <div key={tip.id} className="bg-white rounded-xl shadow-md p-6 border border-gray-200 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-purple-500 text-white">
                            {renderIcon(tip.icon, "h-5 w-5")}
                          </div>
                        </div>
                        <div className="ml-4">
                          <h3 className="text-lg font-medium text-gray-900">{tip.title}</h3>
                          <p className="mt-2 text-gray-600 text-sm">{tip.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Additional Tips Section */}
                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-200 mt-8">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Additional Recovery Tips</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start">
                      <svg className="h-5 w-5 text-purple-500 mt-0.5 mr-3 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <div>
                        <h4 className="font-medium text-gray-900">Stay Active</h4>
                        <p className="text-sm text-gray-600">Light movement and walking can improve circulation and aid digestion.</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <svg className="h-5 w-5 text-purple-500 mt-0.5 mr-3 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                      </svg>
                      <div>
                        <h4 className="font-medium text-gray-900">Rest Well</h4>
                        <p className="text-sm text-gray-600">Quality sleep is essential for healing and immune function.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hydration Tracker */}
                <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <svg className="h-5 w-5 text-blue-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                    Daily Hydration Goal
                  </h3>
                  <p className="text-gray-600 mb-4">Track your daily water intake to ensure proper hydration during recovery.</p>
                  <div className="flex items-center justify-between bg-white rounded-lg p-4">
                    <div className="flex items-center">
                      <span className="text-2xl font-bold text-blue-600">0/8</span>
                      <span className="ml-2 text-gray-600">glasses of water</span>
                    </div>
                    <button
                      type="button"
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
                      onClick={() => alert('Hydration tracking functionality would be implemented here')}
                    >
                      Log Water
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Consultation Section */}
          <div className="mt-12 bg-white shadow-lg overflow-hidden rounded-xl border border-gray-200">
            <div className="px-6 py-8 sm:p-8">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4 flex-1">
                  <h3 className="text-xl font-semibold text-gray-900">Need Personalized Nutrition Advice?</h3>
                  <p className="mt-2 text-gray-600">
                    Our registered dietitians are available to provide personalized nutrition counseling based on your specific medical needs and dietary preferences.
                  </p>
                </div>
              </div>
              <div className="mt-6 flex flex-col sm:flex-row sm:space-x-4 space-y-3 sm:space-y-0">
                <button
                  type="button"
                  onClick={() => alert('Dietitian consultation request would be implemented here')}
                  className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                >
                  <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Schedule Consultation
                </button>
                <button
                  type="button"
                  onClick={() => alert('Download nutrition guide functionality would be implemented here')}
                  className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                >
                  <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download Nutrition Guide
                </button>
              </div>
            </div>
          </div>

          {/* Educational Resources */}
          <div className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Educational Resources</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h4 className="font-medium text-gray-900 mb-2">Nutrition Videos</h4>
                <p className="text-sm text-gray-600 mb-3">Watch educational videos about hospital nutrition and recovery.</p>
                <button className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
                  Watch Now →
                </button>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h4 className="font-medium text-gray-900 mb-2">Recipe Collection</h4>
                <p className="text-sm text-gray-600 mb-3">Healthy recipes you can try at home during recovery.</p>
                <button className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
                  Browse Recipes →
                </button>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h4 className="font-medium text-gray-900 mb-2">Meal Planning Guide</h4>
                <p className="text-sm text-gray-600 mb-3">Learn how to plan balanced meals for optimal recovery.</p>
                <button className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
                  Download Guide →
                </button>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link
              to="/menu"
              className="inline-flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
            >
              <svg className="h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Browse Menu
            </Link>
            <Link
              to="/orders"
              className="inline-flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
            >
              <svg className="h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              View Orders
            </Link>
            <Link
              to="/"
              className="inline-flex items-center justify-center px-4 py-3 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
            >
              <svg className="h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DietaryInfo;

