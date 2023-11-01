import Html from '@kitajs/html';

const NavMenu = ({ children }: Html.PropsWithChildren) => (
  <nav>
    <ul
      id='menu'
      class='fixed right-0 top-0 hidden space-y-2 bg-orange-100 px-10 py-16 md:relative md:flex md:space-x-2 md:space-y-0 md:bg-transparent md:p-0'>
      <li class='fixed right-6 top-4 md:hidden'>
        <button
          class='text-right text-4xl'
          onclick='toggleMenu()'>
          &times;
        </button>
      </li>
      {children}
    </ul>
    <button
      class='text-4xl md:hidden'
      onclick='toggleMenu()'>
      &#9776;
    </button>
  </nav>
);

export default NavMenu;
