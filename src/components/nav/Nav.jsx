import React from 'react'
import '../nav/Nav.css'
import { Link } from 'react-router-dom'

const Nav = () => {
  return (
    <div className='nav'>
        <ul className='nav__item'>
            <li className='nav__item-link'>
              <Link to='/'>Home</Link>
              </li>
            <li className='nav__item-link'>
            <Link to='/reading'>Reading</Link>
            </li>
            <li className='nav__item-link'>
            <Link to='/listening'>Listening</Link>
            </li>
            
        </ul>
    </div>
  )
}

export default Nav