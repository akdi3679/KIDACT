import React, { useState } from 'react';
import { Book, Pencil, Palette, Brain, BookOpen, ChevronRight, Bot, Plus, X, Edit2 } from 'lucide-react';
import './App.css';

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
      <div className="grid-bg" style={{ minHeight: '100vh', width: '100%' }}>
        <div className="customizer-container">
          {/* Main Book Pages Area */}
          <div className="pages-container">
            <div className="pages-inner">
              {bookPages.map((page) => (
                <div 
                  key={page.id}
                  className="page"
                  onDrop={(e) => handleDrop(e, page.id)}
                  onDragOver={handleDragOver}
                >
                  <h2 className="page-title">Page {page.id}</h2>
                  {page.activity ? (
                    <div 
                      className={`activity-preview ${page.activity.color}`}
                      onClick={() => handleActivityClick(page.id, page.activity)}
                    >
                      <button 
                        className="activity-remove"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeActivityFromPage(page.id);
                        }}
                      >
                        <X size={16} />
                      </button>
                      {renderIcon(page.activity.icon, 48)}
                      <span className="activity-name mt-2">{page.activity.name}</span>
                      {page.activity.content && (
                        <div className="mt-4 text-sm bg-white bg-opacity-70 p-2 rounded w-full">
                          {page.activity.content.substring(0, 30)}
                          {page.activity.content.length > 30 ? '...' : ''}
                        </div>
                      )}
                      <button 
                        className="btn btn-primary btn-lg btn-icon mt-4"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleActivityClick(page.id, page.activity);
                        }}
                      >
                        <Edit2 size={16} /> Edit Content
                      </button>
                    </div>
                  ) : (
                    <div className="activity-placeholder">
                      <p>Drag an activity here</p>
                    </div>
                  )}
                </div>
              ))}
              <button 
                onClick={addNewPage}
                className="add-page-btn btn btn-accent btn-lg btn-icon"
              >
                <Plus size={20} /> Add New Page
              </button>
            </div>
          </div>
          {/* Sidebar with Activities */}
          <div className="tools-sidebar">
            <div className="sidebar-header">
              <h2 className="text-xl font-bold text-purple-600">Activities</h2>
            </div>
            <div className="activity-grid">
              {availableActivities.map(activity => (
                <div 
                  key={activity.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, activity)}
                  className={`activity-item ${activity.color}`}
                  title={activity.name}
                >
                  <div className="activity-icon">{renderIcon(activity.icon)}</div>
                  <div className="activity-name">{activity.name}</div>
                </div>
              ))}
            </div>
            {availableActivities.length === 0 && (
              <div className="text-center text-gray-500 mt-8">
                <p>All activities have been used!</p>
                <button 
                  onClick={resetActivities}
                  className="btn btn-primary btn-lg mt-4"
                >
                  Reset Activities
                </button>
              </div>
            )}
          </div>
          {/* Activity Content Editor Modal */}
          {selectedActivityForEdit && (
            <div className="modal-overlay">
              <div className="modal-content">
                <div className="modal-header">
                  <span className="modal-title">{renderIcon(selectedActivityForEdit.icon, 24)} Edit {selectedActivityForEdit.name} Content</span>
                  <button 
                    onClick={() => {
                      setSelectedActivityForEdit(null);
                      setSelectedPageId(null);
                      setActivityContent('');
                    }}
                    className="modal-close"
                  >
                    <X size={24} />
                  </button>
                </div>
                <div className="input-group">
                  <label className="input-label">Activity Content or Instructions</label>
                  <textarea
                    className="input-field textarea-field"
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
                    className="btn btn-accent"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveActivityContent}
                    className="btn btn-primary"
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
            className="preferences-toggle"
          >
            <Bot size={24} />
          </button>
          {/* Preferences Panel */}
          {showPreferencesPanel && (
            <div className="preferences-panel">
              <h3 className="text-lg font-bold mb-4">Child Preferences</h3>
              <div className="space-y-4">
                <div>
                  <label className="input-label">Age</label>
                  <input 
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="input-field"
                    placeholder="e.g. 7"
                  />
                </div>
                <div>
                  <label className="input-label">Interests/Genre</label>
                  <input 
                    type="text"
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                    className="input-field"
                    placeholder="e.g. Space, Animals"
                  />
                </div>
                <div>
                  <label className="input-label">Hobbies</label>
                  <input 
                    type="text"
                    value={hobbies}
                    onChange={(e) => setHobbies(e.target.value)}
                    className="input-field"
                    placeholder="e.g. Drawing, Reading"
                  />
                </div>
                <button
                  onClick={handlePreferencesSubmit}
                  className="btn btn-accent w-full"
                >
                  Get Personalized Activities
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Redesigned Home Page
  return (
    <div className="home-bg">
      <header className="home-header">
        <div className="header-content">
          <div className="header-nav">
            <h1 className="home-title">KidActivity BookCreator</h1>
            <div className="nav-links">
              <a href="#features" className="home-link">Features</a>
              <a href="#about" className="home-link">About</a>
              <button 
                onClick={() => setCurrentPage('customizer')}
                className="hero-cta"
              >
                Start Creating <ChevronRight size={20} />
              </button>
            </div>
          </div>
          
          <div className="hero-section">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="md:w-1/2">
                <h2 className="hero-title">Create Amazing Activity Books for Kids</h2>
                <p className="hero-desc">
                  Build personalized learning experiences with our interactive activity book creator. 
                  Perfect for parents and educators looking to engage children in fun, educational activities.
                </p>
                <button 
                  onClick={() => setCurrentPage('customizer')}
                  className="hero-cta"
                >
                  Start Your Book Now <ChevronRight size={20} />
                </button>
              </div>
              <div className="md:w-1/2 flex justify-center">
                <div className="relative">
                  <div className="fun-element bounce">
                    <Book size={64} />
                  </div>
                  <div className="absolute -bottom-8 -right-8 fun-element pulse">
                    <span>Fun!</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <section id="features" className="features-section">
        <div className="container mx-auto px-4">
          <h2 className="features-title">Why Choose Our Activity Books?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <Brain size={32} />
              </div>
              <h3 className="feature-head">Learning Through Play</h3>
              <p className="feature-desc">Educational activities that make learning fun and engaging for children.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <Pencil size={32} />
              </div>
              <h3 className="feature-head">Skill Development</h3>
              <p className="feature-desc">Activities designed to improve motor skills and cognitive abilities.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <Palette size={32} />
              </div>
              <h3 className="feature-head">Creativity Boost</h3>
              <p className="feature-desc">Spark imagination and self-expression through creative activities.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="about-section">
        <div className="container mx-auto px-4">
          <h2 className="about-title">How It Works</h2>
          <p className="about-desc">
            Create the perfect activity book in three simple steps, tailored to your child's interests and learning goals.
          </p>
          <div className="about-steps">
            <div className="step-card">
              <div className="step-number">1</div>
              <h4 className="step-title">Choose Activities</h4>
              <p className="step-desc">Select from our library of educational and fun activities.</p>
            </div>
            <div className="step-card">
              <div className="step-number">2</div>
              <h4 className="step-title">Customize Content</h4>
              <p className="step-desc">Personalize each activity to match your child's interests.</p>
            </div>
            <div className="step-card">
              <div className="step-number">3</div>
              <h4 className="step-title">Create & Share</h4>
              <p className="step-desc">Generate your book and share it with your children.</p>
            </div>
          </div>
          <div className="text-center mt-12">
            <button 
              onClick={() => setCurrentPage('customizer')}
              className="hero-cta"
            >
              Create Your Activity Book <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </section>

      <footer className="home-footer">
        <div className="footer-content">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h2 className="footer-title">KidActivity BookCreator</h2>
              <p>Making learning fun and engaging</p>
            </div>
            <div className="text-sm opacity-90">
              <p>© 2025 KidActivity BookCreator. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}