const Notifications = props => (
  <section className={`notifications-section ${props.showNotificationsClass}`}>
    <div className="notifications-heading">
      Notifications
      <a
        className="float-right notifications-close cursor-pointer"
        onClick={props.toggleNotifications}
      >
        <img src="/static/images/close-icon.png" />
      </a>
    </div>
    <ul className="list-unstyled">
      <li>
        <a href="#">
          Notifications 1<small>Bengaluru, Karnataka</small>
        </a>
      </li>
      <li>
        <a href="#">
          Notifications 2<small>Bengaluru, Karnataka</small>
        </a>
      </li>
      <li>
        <a href="#">
          Notifications 3<small>Bengaluru, Karnataka</small>
        </a>
      </li>
      <li>
        <a href="#">
          Notifications 4<small>Bengaluru, Karnataka</small>
        </a>
      </li>
    </ul>
  </section>
);

export default Notifications;
