import { useState } from 'react'
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import NavigationBar from './components/NavigationBar';
import './styles/App.css'

function App() {
  const location = useLocation();

  useEffect(()=>{
    switch (location.pathname) {
      case '/admin': document.title = 'UB | Admin'; break;
      case '/management': document.title = 'UB | Product Management'; break;
      case '/return': document.title = 'UB | Returns & Logistics'; break;
      default: document.title = 'UB';
    }
  }, [location]);

  return (
    <div className = "root-container"
    <NavigationBar>
    
    <main className = 'root_page-container'>

    </main>

    </NavigationBar>
  )
}