import Link from "next/link";

const Header = props => (
  // <header>
  //   <div className="row align-items-center no-gutters">
  //     <div className="col-6">
  //       <a
  //         className="menu-icon cursor-pointer"
  //         onClick={event => {
  //           props.toggleMenu(event);
  //         }}
  //       >
  //         <img src="/static/images/menu.png" />
  //       </a>
  //       <a href="#" className="brand-name">
  //         <img src="/static/images/logo.png" />
  //         Atria Power
  //       </a>
  //     </div>
  //     <div className="col-6 text-right">
  //       <ul className="list-inline info-list">
  //         <li className="list-inline-item">
  //           <a href="#">Welcome {props.username}!</a>
  //         </li>

  //         <li className="list-inline-item notifications">
  //           <a
  //             onClick={event => {
  //               props.toggleNotifications(event);
  //             }}
  //             className="cursor-pointer"
  //           >
  //             <img src="/static/images/user-notification.png" />
  //           </a>
  //         </li>

  //         <li className="list-inline-item">
  //           <Link href="/user-profile">
  //             <a>
  //               <img src="/static/images/user-icon.png" />
  //             </a>
  //           </Link>
  //         </li>
  //       </ul>
  //     </div>
  //   </div>
  // </header>
  <header>
    <div className="row align-items-center no-gutters">
      <div className="col-6">
        <a
          href="#"
          className="menu-icon"
          onClick={event => {
            props.toggleMenu(event);
          }}
        >
          <svg width="18px" height="18px" viewBox="0 0 177 130">
            <g
              id="Page-1"
              stroke="none"
              strokeWidth={1}
              fill="none"
              fillRule="evenodd"
            >
              <g id="svg" fillRule="nonzero" fill="#000000">
                <path
                  d="M0,0 L0,10 L176.724,10 L176.724,0 L0,0 Z M0,69.92 L176.724,69.92 L176.724,59.92 L0,59.92 L0,69.92 Z M0,129.84 L107.724,129.84 L107.724,119.84 L0,119.84 L0,129.84 Z"
                  id="Shape"
                />
              </g>
            </g>
          </svg>
        </a>
        <a href="#" className="brand-name">
          <img src="static/images/logo.jpg" />
        </a>
      </div>
      <div className="col-6 text-right">
        <ul className="list-inline info-list">
          <li className="list-inline-item username">
            <a href="#">Welcome {props.username}!</a>
          </li>
          <li className="list-inline-item">
            <a href="/user-profile">
              <svg
                x="0px"
                y="0px"
                width="22px"
                height="22px"
                viewBox="0 0 16 16"
              >
                <g transform="translate(0, 0)">
                  <path
                    data-color="color-2"
                    d="M14.5,12.976a1,1,0,0,0-.426-.82A10.367,10.367,0,0,0,8,10.5a10.367,10.367,0,0,0-6.074,1.656,1,1,0,0,0-.426.82V15.5h13Z"
                    fill="none"
                    stroke="#69951a"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle
                    cx={8}
                    cy={4}
                    r="3.5"
                    fill="none"
                    stroke="#69951a"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
              </svg>
            </a>
          </li>
          <li className="list-inline-item notifications">
            <a
              onClick={event => {
                props.toggleNotifications(event);
              }}
            >
              <svg
                x="0px"
                y="0px"
                width="22px"
                height="22px"
                viewBox="0 0 16 16"
              >
                <g transform="translate(0, 0)">
                  <path
                    data-color="color-2"
                    fill="none"
                    stroke="#69951a"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeMiterlimit={10}
                    d=" M10,13.5c0,1.105-0.895,2-2,2s-2-0.895-2-2"
                  />
                  <line
                    fill="none"
                    stroke="#69951a"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeMiterlimit={10}
                    x1="0.5"
                    y1="11.5"
                    x2="15.5"
                    y2="11.5"
                  />
                  <path
                    fill="none"
                    stroke="#69951a"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeMiterlimit={10}
                    d="M14.5,11.5H15 c-1.105,0-2.5-0.895-2.5-2V5c0-2.485-2.015-4.5-4.5-4.5h0C5.515,0.5,3.5,2.515,3.5,5v4.5c0,1.105-0.895,2-2,2"
                  />
                </g>
              </svg>
            </a>
          </li>
        </ul>
      </div>
    </div>
  </header>
);

export default Header;
