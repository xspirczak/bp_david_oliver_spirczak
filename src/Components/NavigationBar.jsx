'use client'

import {useEffect, useState} from 'react'
import {
  Dialog,
  DialogPanel,
  Popover, PopoverButton,
  PopoverGroup, PopoverPanel,
} from '@headlessui/react'
import {
  Bars3Icon, ChevronDownIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'

import {NavLink, useNavigate} from 'react-router-dom'
import LogOutAlert from "./LogOutAlert.jsx";
import {jwtDecode} from "jwt-decode";
import {FaUserCircle} from "react-icons/fa";

export default function Navbar({ isLoggedIn, setIsLoggedIn, user, setUser}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const navigate = useNavigate();
  const [showLogoutAlert, setShowLogoutAlert] = useState(false);
  const [fullName, setFullName] = useState(localStorage.getItem('fullName'));

  const [avatarUrl, setAvatarUrl] = useState("");


  useEffect(() => {
    const updateAvatar = () => {
      const fullName = localStorage.getItem('fullName');
      if (fullName) {
        setFullName(fullName);
        setAvatarUrl(`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(fullName)}`);
      } else {
        setAvatarUrl('');
        setFullName('');
      }
    };

    window.addEventListener('fullNameUpdated', updateAvatar);

    updateAvatar();

    return () => {
      window.removeEventListener('fullNameUpdated', updateAvatar);
    };
  }, []);


  const getActiveStyles = ({isActive}) => {
    return {
      "textDecoration": isActive ? 'underline' : 'none',
      "textUnderlineOffset": isActive ? '5px' : 'none'
    }
  }

  // Trigger the alert instead of logging out immediately.
  const handleLogoutClick = () => {
    setShowLogoutAlert(true);
  };

  // Called when the user confirms logout in the alert.
  const confirmLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('fullName');
    setUser(null);
    setIsLoggedIn(false);
    setShowLogoutAlert(false);
    navigate('/login');
  };

  // Called when the user cancels the logout.
  const dismissLogout = () => {
    setShowLogoutAlert(false);
  };


  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const name = decoded.fullName || "Neznámy používateľ";
        setFullName(name);
        window.dispatchEvent(new Event('fullNameUpdated'));
      } catch (error) {
        console.error("Neplatný token", error);
        localStorage.removeItem("token");
        localStorage.removeItem('fullName');
        setIsLoggedIn(false);
        navigate("/login");
      }
    }
  }, []);


  return (
    <header className="bg-gradient-to-r from-blue-500 to-cyan-200">
      <nav aria-label="Global" className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8">
        <div className="flex lg:flex-1">
          <NavLink to="/" className="text-white font-extrabold md:text-fontSize32 sm:text-fontSize28 text-fontSize24">
            CipherMatcher
          </NavLink>
        </div>
        <div className="flex lg:hidden gap-3">
          {isLoggedIn ? (<Popover className="relative">
                <PopoverButton className="flex items-center space-x-2">
                  {avatarUrl ? (
                      <img
                          src={avatarUrl}
                          alt="profilePhoto"
                          className="w-10 h-10 rounded-full border border-gray-300"
                      />
                  ) :         <FaUserCircle className="text-custom-dark-blue w-10 h-10" />
                  }

                  <ChevronDownIcon className="w-5 h-5 text-white"/>
                </PopoverButton>

                <PopoverPanel
                    className="absolute right-0 mt-2 w-56 bg-white text-custom-dark-blue shadow-lg rounded-md border border-custom-dark-blue font-semibold">
                <div className="px-4 py-3 border-b border-custom-dark-blue">
                    <p className="text-sm font-semibold">{fullName || "-"}</p>
                    <p className="text-xs text-gray-400">{user || "-"}</p>
                  </div>

                  <div className="py-2 hover:bg-custom-dark-blue-hover hover:text-white">
                    <NavLink to="/profile" className="block w-full text-left px-4 py-2 text-sm">
                      Profil
                    </NavLink>
                  </div>

                  <div className="border-t border-custom-dark-blue">
                    <button
                        onClick={handleLogoutClick}
                        className="block w-full text-left px-4 py-2 text-sm hover:bg-custom-dark-blue-hover text-red-400"
                    >
                      Odhlásiť sa
                    </button>
                  </div>
                </PopoverPanel>
              </Popover>
          ) : null}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon aria-hidden="true" className="h-6 w-6" />
          </button>
        </div>
        <PopoverGroup className="hidden lg:flex lg:gap-x-12">
          <Popover className="relative">
          </Popover>

          <NavLink to="/" style={getActiveStyles} className="-mx-3 block rounded-lg px-3 py-2 text-fontSize20 font-semibold leading-7 text-white hover:bg-gray-50 hover:text-gray-900">
            Domov
          </NavLink>
          <NavLink to="/mapping" style={getActiveStyles} className="-mx-3 block rounded-lg px-3 py-2 text-fontSize20 font-semibold leading-7 text-white hover:bg-gray-50 hover:text-gray-900">
            Mapovanie
          </NavLink>
          <NavLink to="/keys" style={getActiveStyles} className="-mx-3 block rounded-lg px-3 py-2 text-fontSize20 font-semibold leading-7 text-white hover:bg-gray-50 hover:text-gray-900">
            Kľúče
          </NavLink>
          <NavLink to="/texts" style={getActiveStyles} className="-mx-3 block rounded-lg px-3 py-2 text-fontSize20 font-semibold leading-7 text-white hover:bg-gray-50 hover:text-gray-900">
            Texty
          </NavLink>
          <NavLink to="/search" style={getActiveStyles} className="-mx-3 block rounded-lg px-3 py-2 text-fontSize20 font-semibold leading-7 text-white hover:bg-gray-50 hover:text-gray-900">
            Vyhľadávať
          </NavLink>

        </PopoverGroup>
           {isLoggedIn ? (
               <div className="hidden lg:flex lg:flex-1 lg:justify-end">
                 <div className="relative">
                   {isLoggedIn ? (
                       <Popover className="relative">
                         <PopoverButton className="flex items-center space-x-2">
                           {avatarUrl ? (
                               <img
                                   src={avatarUrl}
                                   alt="profilePhoto"
                                   className="w-10 h-10 rounded-full border border-gray-300"
                               />
                           ) :         <FaUserCircle className="text-custom-dark-blue w-10 h-10" />
                           }
                           <ChevronDownIcon className="w-5 h-5 text-white"/>
                         </PopoverButton>

                         <PopoverPanel
                             className="absolute right-0 mt-2 w-56 bg-white text-custom-dark-blue shadow-lg rounded-md border border-custom-dark-blue font-semibold">
                           <div className="px-4 py-3 border-b border-custom-dark-blue">
                             <p className="text-sm font-semibold">{fullName || "-"}</p>
                             <p className="text-xs text-gray-400">{user || "-"}</p>
                           </div>

                           <div className="py-2 hover:bg-custom-dark-blue-hover hover:text-white">
                             <NavLink to="/profile" className="block w-full text-left px-4 py-2 text-sm">
                               Profil
                             </NavLink>
                           </div>

                           <div className="border-t border-custom-dark-blue">
                             <button
                                 onClick={handleLogoutClick}
                                 className="block w-full text-left px-4 py-2 text-sm hover:bg-custom-dark-blue-hover text-red-400"
                             >
                               Odhlásiť sa
                             </button>
                           </div>
                         </PopoverPanel>
                       </Popover>
                   ) : null}
                 </div>
               </div>
           ) : (
               <div className="hidden lg:flex lg:flex-1 lg:justify-end">
                 <div
                     className="border-2 border-custom-dark-blue bg-custom-dark-blue rounded-full px-2.5 py-1 hover:bg-custom-dark-blue-hover hover:border-custom-dark-blue-hover">

                   <NavLink to="/login" className="text-fontSize16 font-semibold leading-6 text-white">
                     Prihlásiť sa
                   </NavLink>

                 </div>
               </div>
           )}
      </nav>
      <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
        <div className="fixed inset-0 z-10"/>
        <DialogPanel
            className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">

          <div className="flex items-center justify-between">

            <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="-m-2.5 rounded-md p-2.5 text-gray-700"
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon aria-hidden="true" className="h-6 w-6"/>
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                <NavLink to="/" onClick={() => setMobileMenuOpen(false)}
                         className="-mx-3 block rounded-lg px-3 py-2 text-fontSize20 font-semibold leading-7 text-gray-900 hover:bg-gray-50">
                  Domov
                </NavLink>
                <NavLink to="/mapping" onClick={() => setMobileMenuOpen(false)}
                         className="-mx-3 block rounded-lg px-3 py-2 text-fontSize20 font-semibold leading-7 text-gray-900 hover:bg-gray-50">
                  Mapovanie
                </NavLink>
                <NavLink to="/keys" onClick={() => setMobileMenuOpen(false)}
                         className="-mx-3 block rounded-lg px-3 py-2 text-fontSize20 font-semibold leading-7 text-gray-900 hover:bg-gray-50">
                  Kľúče
                </NavLink>
                <NavLink to="/texts" onClick={() => setMobileMenuOpen(false)}
                         className="-mx-3 block rounded-lg px-3 py-2 text-fontSize20 font-semibold leading-7 text-gray-900 hover:bg-gray-50">
                  Texty
                </NavLink>
                <NavLink to="/search" onClick={() => setMobileMenuOpen(false)}
                         className="-mx-3 block rounded-lg px-3 py-2 text-fontSize20 font-semibold leading-7 text-gray-900 hover:bg-gray-50">
                  Vyhľadávať
                </NavLink>
              </div>

                  {isLoggedIn ? (
                      <></>
                  ) : (
                      <div className="py-6">
                        <div className="border-2 border-custom-dark-blue bg-custom-dark-blue rounded-full px-2.5 py-1 w-32 flex justify-center">
                      <NavLink to="/login" onClick={() => setMobileMenuOpen(false)} className="text-fontSize16 font-semibold leading-6 text-white">
                        Prihlásiť sa
                      </NavLink>
                        </div>
                      </div>
                  )}

            </div>
          </div>
        </DialogPanel>
      </Dialog>
      {showLogoutAlert && (
          <LogOutAlert onConfirm={confirmLogout} onDismiss={dismissLogout}/>
      )}
    </header>


  )
}
