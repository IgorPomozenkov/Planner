import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer>
      <div className="container">
        <p className="footerText">&copy; {currentYear} Planner</p>
        <div className="footerLinks">
          <a href="#"><i className="fa fa-telegram fa-lg" aria-hidden="true"></i></a>
          <a href="#"><i className="fa fa-vk fa-lg" aria-hidden="true"></i></a>
          <a href="#"><i className="fa fa-envelope fa-lg" aria-hidden="true"></i></a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
