'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogPanel,
  Popover,
  PopoverGroup,
} from '@headlessui/react'
import {
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline'

import {NavLink} from 'react-router-dom'

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const getActiveStyles = ({isActive}) => {
    return {
      "textDecoration": isActive ? 'underline' : 'none',
      "textUnderlineOffset": isActive ? '5px' : 'none'
    }
  }

  return (
    <header className="bg-gradient-to-r from-blue-500 to-cyan-200">
      <nav aria-label="Global" className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8">
        <div className="flex lg:flex-1">
          <NavLink to="/" className="text-white font-extrabold text-fontSize32">
            Lorem
          </NavLink>
        </div>
        <div className="flex lg:hidden">
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
          <NavLink to="/documents" style={getActiveStyles} className="-mx-3 block rounded-lg px-3 py-2 text-fontSize20 font-semibold leading-7 text-white hover:bg-gray-50 hover:text-gray-900">
            Dokumenty
          </NavLink>
          <NavLink to="/search" style={getActiveStyles} className="-mx-3 block rounded-lg px-3 py-2 text-fontSize20 font-semibold leading-7 text-white hover:bg-gray-50 hover:text-gray-900">
            Vyhľadávať
          </NavLink>
        </PopoverGroup>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <div className="border-2 border-custom-dark-blue bg-custom-dark-blue rounded-full px-2.5 py-1 hover:bg-custom-dark-blue-hover hover:border-custom-dark-blue-hover">
            <NavLink to="/login" className="text-md font-semibold leading-6 text-white">
              Prihlásiť sa
            </NavLink>
          </div>
        </div>
      </nav>
      <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
        <div className="fixed inset-0 z-10" />
        <DialogPanel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <a href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">Substitution cipher key mapping webapp</span>
              <img
                alt=""
                src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=600"
                className="h-8 w-auto"
              />
            </a>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon aria-hidden="true" className="h-6 w-6" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                <NavLink to="/" className="-mx-3 block rounded-lg px-3 py-2 text-fontSize20 font-semibold leading-7 text-gray-900 hover:bg-gray-50">
                  Domov
                </NavLink>
                <NavLink to="/mapping" className="-mx-3 block rounded-lg px-3 py-2 text-fontSize20 font-semibold leading-7 text-gray-900 hover:bg-gray-50">
                  Mapovanie
                </NavLink>
                <NavLink to="/keys" className="-mx-3 block rounded-lg px-3 py-2 text-fontSize20 font-semibold leading-7 text-gray-900 hover:bg-gray-50">
                  Kľúče
                </NavLink>
                <NavLink to="/documents" className="-mx-3 block rounded-lg px-3 py-2 text-fontSize20 font-semibold leading-7 text-gray-900 hover:bg-gray-50">
                  Dokumenty
                </NavLink>
                <NavLink to="/search" className="-mx-3 block rounded-lg px-3 py-2 text-fontSize20 font-semibold leading-7 text-gray-900 hover:bg-gray-50">
                  Vyhľadávať
                </NavLink>
              </div>
              <div className="py-6">
                 <div className="border-2 border-custom-dark-blue bg-custom-dark-blue rounded-full px-2.5 py-1 w-32 flex justify-center">
                   <NavLink to="/login" className="text-md font-semibold leading-6 text-white">
                     Prihlásiť sa
                   </NavLink>
                </div>
                </div>
              </div>
            </div>
        </DialogPanel>
      </Dialog>
    </header>
  )
}
