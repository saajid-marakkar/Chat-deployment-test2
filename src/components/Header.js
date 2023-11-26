import React from 'react'

function Header() {
    return (
        
        <div className="inner-container d-none d-sm-block">
            <div className="nav-item privacy">
                <a className="nav-link" href="#">Privacy Policy</a>
            </div>
            <nav className="navbar navbar-expand-lg navbar-dark sticky-top">
                <div className="header-left">
                    <div className="logo">
                        <a className="navbar-brand" href="#">Santa Chatter</a>
                        <p>Christmas is coming</p>
                    </div>
                    <div className="online">Online <span></span></div>
                </div>
                <div className="header-right">
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown"
                        aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                        <img alt="Menu" width="24" height="24" src="images/align-right.png" />
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNavDropdown">
                        <ul className="navbar-nav ml-auto">
                            <li className="nav-item">
                                <a className="nav-link pricing" href="#">Pricing</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link faq" href="#">FAQ's</a>
                            </li>
                            {/* <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" role="button"
                                    data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    English
                                </a>
                                <div class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                                    <a class="dropdown-item" href="#">Spanish</a>
                                    <a class="dropdown-item" href="#">French</a>
                                </div>
                            </li> */}
                        </ul>
                    </div>
                </div>
            </nav>

        </div>
    )
}

export default Header