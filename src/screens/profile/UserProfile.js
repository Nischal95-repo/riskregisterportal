import { Link } from "react-router-dom";
import { withApollo } from "react-apollo";
import { getUserProfileQuery } from "../../services/graphql/queries/profile";
import React from "react";
class UserProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {}
    };
  }
  componentDidMount() {
    this.props.client
      .query({
        query: getUserProfileQuery,
        variables: {},
        fetchPolicy: "network-only"
      })
      .then(result => {
        let user = result.data.getUserProfile;
        // user = JSON.parse(user);
        console.log(user);
        this.setState({ user: user });
      })
      .catch(error => {
        console.log("~~~error: ", error);
        this.setState({ error: error.message });
      });
  }
  render() {
    const { user } = this.state;
    return (
      <>
        <h1 className="heading m-b-25">User Profile</h1>
        <div className="row">
          <div className="col-md-12">
            <div className="box-card">
              <div className="row">
                <div className="col">
                  <div className="form-group">
                    <label>Name</label>
                    <input
                      type="text"
                      readOnly
                      className="form-control-plaintext"
                      value={user && user.name ? user.name : ""}
                    />
                  </div>
                </div>
                <div className="col">
                  <div className="form-group">
                    <label>Email Address</label>
                    <input
                      type="text"
                      readOnly
                      className="form-control-plaintext"
                      value={user && user.emailId ? user.emailId : ""}
                    />
                  </div>
                </div>
                <div className="col">
                  <div className="form-group">
                    <label>Phone Number </label>
                    <input
                      type="text"
                      readOnly
                      className="form-control-plaintext"
                      value={user && user.mobileNumber ? user.mobileNumber : ""}
                    />
                  </div>
                </div>
              </div>
              <div className="row m-t-30 m-b-10">
                <Link to="/user-edit">
                  <button className="btn btn-danger mr-4">Edit Profile</button>
                </Link>

                <Link to="/change-password">
                  <button className="btn btn-danger ">Change Password</button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default withApollo(UserProfile);
