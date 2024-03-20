import React, { useEffect, useState } from 'react';
import axios from 'axios';

function HomePage() {
  const [categories, setCategories] = useState({ SCAT: [], DSCAT: [] });
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      // If no token is found, redirect to login page
      window.location.href = '/login';
      return;
    }

    const fetchCategories = async () => {
      try {
        const response = await axios.get(`https://ecom-server-y427.onrender.com/api/getCategory?page=${currentPage}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCategories(response.data);
        setSelectedCategories(response.data.SCAT.map(category => category.id));
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories(); // Initial fetch
  }, [currentPage]); // Fetch whenever currentPage changes

  const handleCheckboxChange = async (category) => {
    const categoryId = category.id;
    const updatedSelectedCategories = selectedCategories.includes(categoryId)
      ? selectedCategories.filter(id => id !== categoryId)
      : [...selectedCategories, categoryId];
    setSelectedCategories(updatedSelectedCategories);

    try {
      const token = localStorage.getItem('token');
      await axios.patch('https://ecom-server-y427.onrender.com/api/category/isSelect', {
        categoryId: categoryId,
        isSelected: !selectedCategories.includes(categoryId),
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Selections saved successfully.");
    } catch (error) {
      console.error("Error saving selections:", error);
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber); // Update currentPage when the page changes
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    // Redirect to the login page or any other desired route
    window.location.href = '/login';
  };

  return (
    <div>
      <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 20px', backgroundColor: '#333', color: '#fff' }}>
        <div>
          <span>Navbar</span>
        </div>
        <div>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </nav>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <div style={{ backgroundColor: '#f0f0f0', padding: '20px', borderRadius: '10px' }}>
          <h1>Home Page</h1>
          <ul>
            {categories.SCAT.map((category) => (
              <li key={category.id}>
                <label>
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category.id)}
                    onChange={() => handleCheckboxChange(category)}
                  />
                  {category.name}
                </label>
              </li>
            ))}
            {categories.DSCAT.map((category) => (
              <li key={category.id}>
                <label>
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category.id)}
                    onChange={() => handleCheckboxChange(category)}
                  />
                  {category.name}
                </label>
              </li>
            ))}
          </ul>
          <div>
            {Array.from({ length: totalPages }, (_, i) => (
              <button key={i} onClick={() => handlePageChange(i + 1)}>{i + 1}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
