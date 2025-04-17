import React, { useState } from 'react';
import { Book, Pencil, Palette, Brain, BookOpen, ChevronRight, Settings, Plus, X, Edit2 } from 'lucide-react';

export default function HomePage() {
  const [currentPage, setCurrentPage] = useState('home');
  const [bookPages, setBookPages] = useState([
    { id: 1, activity: null },
    { id: 2, activity: null },
    { id: 3, activity: null }
  ]);
  const [showPreferencesPanel, setShowPreferencesPanel] = useState(false);
  const [age, setAge] = useState('');
  const [genre, setGenre] = useState('');
  const [hobbies, setHobbies] = useState('');
  const [selectedActivityForEdit, setSelectedActivityForEdit] = useState(null);
  const [activityContent, setActivityContent] = useState('');
  const [selectedPageId, setSelectedPageId] = useState(null);

  // A4 size ratio in CSS (width:height = 1:√2 = 1:1.414)
  const a4Width = 595; // in pixels at 72dpi
  const a4Height = 842; // in pixels at 72dpi

  // Available activities for the sidebar with unique IDs
  const initialActivities = [
    { id: 'act-1', name: 'Coloring', icon: 'palette', color: 'bg-pink-400', content: '' },
    { id: 'act-2', name: 'Connect Dots', icon: 'pencil', color: 'bg-green-400', content: '' },
    { id: 'act-3', name: 'Word Search', icon: 'book', color: 'bg-yellow-400', content: '' },
    { id: 'act-4', name: 'Math Puzzles', icon: 'brain', color: 'bg-blue-400', content: '' },
    { id: 'act-5', name: 'Reading', icon: 'book-open', color: 'bg-purple-400', content: '' },
  ];
  
  const [availableActivities, setAvailableActivities] = useState(initialActivities);

  // Function to render icon based on name
  const renderIcon = (iconName, size = 24) => {
    switch(iconName) {
      case 'palette':
        return <Palette size={size} />;
      case 'pencil':
        return <Pencil size={size} />;
      case 'book':
        return <Book size={size} />;
      case 'brain':
        return <Brain size={size} />;
      case 'book-open':
        return <BookOpen size={size} />;
      default:
        return <Book size={size} />;
    }
  };

  // Function to handle drag start
  const handleDragStart = (e, activity) => {
    e.dataTransfer.setData('activityData', JSON.stringify(activity));
  };

  // Function to handle drop
  const handleDrop = (e, pageId) => {
    e.preventDefault();
    try {
      // Check if the page already has an activity
      const page = bookPages.find(p => p.id === pageId);
      if (page.activity !== null) {
        return; // Page already has an activity
      }
      
      const activityData = JSON.parse(e.dataTransfer.getData('activityData'));
      
      // Add activity to the specific page
      const updatedPages = bookPages.map(page => {
        if (page.id === pageId) {
          return { ...page, activity: activityData };
        }
        return page;
      });
      
      setBookPages(updatedPages);
      
      // Remove activity from sidebar
      setAvailableActivities(availableActivities.filter(act => act.id !== activityData.id));
    } catch (error) {
      console.error("Error processing drop:", error);
    }
  };

  // Function to allow drop
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // Function to add a new page
  const addNewPage = () => {
    setBookPages([...bookPages, { id: bookPages.length + 1, activity: null }]);
  };

  // Function to reset activities
  const resetActivities = () => {
    setAvailableActivities(initialActivities);
  };

  // Function to handle activity click in a page
  const handleActivityClick = (pageId, activity) => {
    setSelectedPageId(pageId);
    setSelectedActivityForEdit(activity);
    setActivityContent(activity.content || '');
  };

  // Function to remove activity from page
  const removeActivityFromPage = (pageId) => {
    // Find the activity in the page
    const page = bookPages.find(p => p.id === pageId);
    if (!page || !page.activity) return;
    
    const activityToReturn = page.activity;
    
    // Remove from page
    const updatedPages = bookPages.map(page => {
      if (page.id === pageId) {
        return { ...page, activity: null };
      }
      return page;
    });
    
    setBookPages(updatedPages);
    
    // Add back to sidebar
    setAvailableActivities([...availableActivities, activityToReturn]);
    
    // Clear edit state if this was the selected activity
    if (selectedPageId === pageId) {
      setSelectedActivityForEdit(null);
      setSelectedPageId(null);
      setActivityContent('');
    }
  };

  // Function to save activity content
  const saveActivityContent = () => {
    if (!selectedActivityForEdit || selectedPageId === null) return;
    
    // Update activity content in the page
    const updatedPages = bookPages.map(page => {
      if (page.id === selectedPageId && page.activity) {
        const updatedActivity = {...page.activity, content: activityContent};
        return { ...page, activity: updatedActivity };
      }
      return page;
    });
    
    setBookPages(updatedPages);
    
    // Clear edit state
    setSelectedActivityForEdit(null);
    setSelectedPageId(null);
    setActivityContent('');
  };

  // Function to handle preferences submission
  const handlePreferencesSubmit = () => {
    // In a real app, we would call an AI API here
    alert(`Getting recommendations for a ${age} year old who likes ${genre} and enjoys ${hobbies}`);
    setShowPreferencesPanel(false);
  };

  if (currentPage === 'customizer') {
    return (
      <div className="min-h-screen bg-white" 
        style={{
          backgroundImage: "linear-gradient(#e6e6e6 1px, transparent 1px), linear-gradient(90deg, #e6e6e6 1px, transparent 1px)",
          backgroundSize: "20px 20px"
        }}>
        <nav className="bg-blue-600 p-4 text-white shadow-md">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-bold">KidActivity BookCreator</h1>
            <button 
              onClick={() => setCurrentPage('home')}
              className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors"
            >
              Back to Home
            </button>
          </div>
        </nav>

        <div className="container mx-auto p-4 flex h-screen">
          {/* Main Book Pages Area */}
          <div className="flex-grow flex flex-col items-center overflow-y-auto">
            {bookPages.map((page) => (
              <div 
                key={page.id}
                className="mb-8 bg-white shadow-lg border-2 border-gray-300 p-4 rounded relative"
                style={{ 
                  width: `${a4Width * 0.5}px`, 
                  height: `${a4Height * 0.5}px`,
                  aspectRatio: '1/1.414'
                }}
                onDrop={(e) => handleDrop(e, page.id)}
                onDragOver={handleDragOver}
              >
                <h2 className="text-center text-lg font-semibold border-b pb-2 mb-4">Page {page.id}</h2>
                
                {page.activity ? (
                  <div 
                    className={`${page.activity.color} p-6 rounded-lg flex flex-col items-center justify-center m-2 shadow-md relative w-3/4 mx-auto h-3/4`}
                    onClick={() => handleActivityClick(page.id, page.activity)}
                  >
                    <button 
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeActivityFromPage(page.id);
                      }}
                    >
                      <X size={16} />
                    </button>
                    {renderIcon(page.activity.icon, 48)}
                    <span className="mt-2 font-semibold">{page.activity.name}</span>
                    {page.activity.content && (
                      <div className="mt-4 text-sm bg-white bg-opacity-70 p-2 rounded w-full">
                        {page.activity.content.substring(0, 30)}
                        {page.activity.content.length > 30 ? '...' : ''}
                      </div>
                    )}
                    <button 
                      className="mt-4 bg-blue-500 text-white rounded-lg p-2 flex items-center"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleActivityClick(page.id, page.activity);
                      }}
                    >
                      <Edit2 size={16} className="mr-1" /> Edit Content
                    </button>
                  </div>
                ) : (
                  <div className="h-4/5 flex items-center justify-center text-gray-400 border-2 border-dashed border-gray-300 rounded-lg">
                    <p>Drag an activity here</p>
                  </div>
                )}
              </div>
            ))}
            
            {/* Add Page Button */}
            <button 
              onClick={addNewPage}
              className="mb-16 bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center shadow-md hover:bg-blue-700 transition-colors"
            >
              <Plus size={20} className="mr-2" /> Add New Page
            </button>
          </div>

          {/* Sidebar with Activities */}
          <div className="w-64 bg-white shadow-lg p-4 ml-4 rounded-lg h-full overflow-y-auto">
            <h2 className="text-xl font-bold mb-4 text-center text-blue-600">Activities</h2>
            <div className="grid grid-cols-2 gap-4">
              {availableActivities.map(activity => (
                <div 
                  key={activity.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, activity)}
                  className={`${activity.color} p-4 rounded-lg cursor-move flex items-center justify-center h-20 w-20 shadow-md hover:shadow-lg transition-shadow`}
                  title={activity.name}
                >
                  {renderIcon(activity.icon)}
                </div>
              ))}
            </div>
            {availableActivities.length === 0 && (
              <div className="text-center text-gray-500 mt-8">
                <p>All activities have been used!</p>
                <button 
                  onClick={resetActivities}
                  className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
                >
                  Reset Activities
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Activity Content Editor Modal */}
        {selectedActivityForEdit && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold flex items-center">
                  {renderIcon(selectedActivityForEdit.icon, 24)}
                  <span className="ml-2">Edit {selectedActivityForEdit.name} Content</span>
                </h3>
                <button 
                  onClick={() => {
                    setSelectedActivityForEdit(null);
                    setSelectedPageId(null);
                    setActivityContent('');
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Activity Content or Instructions
                </label>
                <textarea
                  className="w-full h-64 p-3 border rounded-lg"
                  value={activityContent}
                  onChange={(e) => setActivityContent(e.target.value)}
                  placeholder="Enter activity content, instructions, or paste image URL here..."
                ></textarea>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setSelectedActivityForEdit(null); 
                    setSelectedPageId(null);
                    setActivityContent('');
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={saveActivityContent}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Save Content
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Fixed Preferences Button */}
        <button
          onClick={() => setShowPreferencesPanel(!showPreferencesPanel)}
          className="fixed bottom-4 right-4 bg-purple-600 text-white p-3 rounded-full shadow-lg hover:bg-purple-700 transition-colors"
        >
          <Settings size={24} />
        </button>

        {/* Preferences Panel */}
        {showPreferencesPanel && (
          <div className="fixed bottom-20 right-4 bg-white shadow-xl p-6 rounded-lg w-80">
            <h3 className="text-lg font-bold mb-4">Child Preferences</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                <input 
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full p-2 border rounded-md"
                  placeholder="e.g. 7"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Interests/Genre</label>
                <input 
                  type="text"
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                  className="w-full p-2 border rounded-md"
                  placeholder="e.g. Space, Animals"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hobbies</label>
                <input 
                  type="text"
                  value={hobbies}
                  onChange={(e) => setHobbies(e.target.value)}
                  className="w-full p-2 border rounded-md"
                  placeholder="e.g. Drawing, Reading"
                />
              </div>
              <button
                onClick={handlePreferencesSubmit}
                className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 transition-colors"
              >
                Get Personalized Activities
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-50">
      <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <nav className="container mx-auto p-4 flex justify-between items-center">
          <h1 className="text-2xl md:text-3xl font-bold">KidActivity BookCreator</h1>
          <div className="space-x-4">
            <a href="#features" className="hover:text-blue-200 transition-colors">Features</a>
            <a href="#about" className="hover:text-blue-200 transition-colors">About</a>
            <button 
              onClick={() => setCurrentPage('customizer')}
              className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors"
            >
              Create Custom Book
            </button>
          </div>
        </nav>

        <div className="container mx-auto py-16 px-4 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">Create Personalized Activity Books for Your Child</h2>
            <p className="text-lg mb-6">Engage their minds, spark creativity, and make learning fun with custom activities tailored to their interests and developmental needs.</p>
            <button 
              onClick={() => setCurrentPage('customizer')}
              className="bg-yellow-400 text-blue-900 px-6 py-3 rounded-lg font-bold text-lg hover:bg-yellow-300 transition-colors flex items-center"
            >
              Start Creating <ChevronRight size={20} className="ml-2" />
            </button>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <div className="bg-white rounded-lg shadow-xl p-6 transform rotate-3 w-64 h-80 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <Book size={64} className="text-blue-600" />
              </div>
              <div className="absolute -bottom-12 -right-12 bg-yellow-400 rounded-full w-24 h-24 flex items-center justify-center transform rotate-12">
                <span className="font-bold text-blue-900">Fun!</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <section id="features" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-blue-800">Why Activity Books Matter</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-blue-50 p-6 rounded-lg shadow-md">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                <Brain size={32} className="text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Cognitive Development</h3>
              <p>Activity books enhance problem-solving skills and critical thinking through engaging puzzles and challenges.</p>
            </div>
            
            <div className="bg-purple-50 p-6 rounded-lg shadow-md">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                <Pencil size={32} className="text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Fine Motor Skills</h3>
              <p>Drawing, tracing, and handwriting activities help develop fine motor control and hand-eye coordination.</p>
            </div>
            
            <div className="bg-green-50 p-6 rounded-lg shadow-md">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                <Palette size={32} className="text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Creativity & Expression</h3>
              <p>Art and creative activities provide children with healthy outlets for self-expression and imagination.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="py-16 bg-blue-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8 text-blue-800">Create Books That Grow With Your Child</h2>
          <p className="text-lg text-center max-w-3xl mx-auto mb-12">
            Our custom activity book creator lets you build the perfect learning experience based on your child's age, interests, and development goals. Each page can be tailored to their specific needs.
          </p>
          
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold mb-4 text-center">How It Works</h3>
            <ol className="space-y-6">
              <li className="flex items-start">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0">1</div>
                <div>
                  <h4 className="font-bold text-lg">Enter Your Child's Information</h4>
                  <p>Share your child's age, interests, and learning goals to get personalized activity recommendations.</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0">2</div>
                <div>
                  <h4 className="font-bold text-lg">Drag & Drop Activities</h4>
                  <p>Build your custom book by selecting from our library of educational and fun activities.</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0">3</div>
                <div>
                  <h4 className="font-bold text-lg">Generate & Download</h4>
                  <p>Create your personalized activity book, ready to print or use digitally.</p>
                </div>
              </li>
            </ol>
            
            <div className="mt-8 text-center">
              <button 
                onClick={() => setCurrentPage('customizer')}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold text-lg hover:bg-blue-700 transition-colors"
              >
                Start Creating Your Custom Book
              </button>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-blue-900 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h2 className="text-2xl font-bold">KidActivity BookCreator</h2>
              <p>Helping children learn through play</p>
            </div>
            <div>
              <p>© 2025 KidActivity BookCreator. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}