import React from "react";
import Link from "react-rout";
import { withRouter } from "react-router-dom";

class NavItem extends React.Component {
  render() {
    const { link, name, iconPath, router } = this.props;

    return (
      <li>
        <Link href={link}>
          <a
            className={router.asPath === link ? "active" : ""}
            data-toggle="tooltip"
            data-placement="bottom"
            title={name}
          >
            <figure>
              <img src={iconPath} />
            </figure>
            <span>{name}</span>
          </a>
        </Link>
      </li>
    );
  }
}

export default withRouter(NavItem);
