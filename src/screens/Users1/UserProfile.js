import React from "react";
import { withRouter } from "react-router-dom";
// import { connect } from "react-redux";
import { withApollo } from "react-apollo";
import { getUserByIdQuery } from "../../services/graphql/queries/user";
import { getAccessPermisionQuery } from "../../services/graphql/queries/accessPermission";
import queryString from "query-string";
import ReactModal from "../Common/ReactModal";

import { DO_NOT_ACCESS_MESSAGE } from "../../constants/app-constants";

import UserView from "./UserView";
import UserEdit from "./UserEdit";
import UserDetails from "./UserDetails";

const USER_MODULE_ID = 1;

const USER_FEATURE_ID = 100;
const USER_ROLES_FEATURE_ID = 101;

class UserProfile extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: false,
      errors: [],
      editMode: false,
      user: {},
      reactModalVisible: false,
      requireCancel: false,
      modalMessage: DO_NOT_ACCESS_MESSAGE,
      accessSpecifier: {}
    };
    this.toggleEditMode = this.toggleEditMode.bind(this);
    this.submitModal = this.submitModal.bind(this);
    this.onUpdateUser = this.onUpdateUser.bind(this);
  }

  submitModal() {
    this.setState({ reactModalVisible: false });
  }

  toggleEditMode(mode) {
    // this.setState({ editMode: !this.state.editMode });
    if (this.state.accessSpecifier[USER_FEATURE_ID].editP)
      this.setState({ editMode: !this.state.editMode });
    else this.setState({ reactModalVisible: true });
  }

  onUpdateUser() {
    this.getUserById();
  }

  getUserById() {
    this.props.client
      .query({
        query: getUserByIdQuery,
        variables: {
          id: parseInt(queryString.parse(this.props.location.search).id)
        },
        fetchPolicy: "network-only"
      })
      .then(result => {
        const user = result.data.findOrgUserById;

        this.initialState = {
          user: user
        };
        this.setState({ ...this.initialState, loading: false, error: "" });
      })
      .catch(error => {
        console.log("~~~error: ", error);
        this.setState({ loading: false, error: error.message });
      });
  }

  componentDidMount() {
    this.setState({ loading: true });
    this.props.client
      .query({
        query: getAccessPermisionQuery,
        variables: {
          moduleId: USER_MODULE_ID
        },
        fetchPolicy: "network-only"
      })
      .then(result => {
        let response = result.data.getFunctionByModuleId;
        response = JSON.parse(response);
        this.setState({
          accessSpecifier: response
        });
        this.getUserById();
      })
      .catch(error => {
        this.setState({
          loading: false,
          error: error.message
        });
      });
  }

  render() {
    const {
      accessSpecifier,
      editMode,
      user,
      reactModalVisible,
      requireCancel,
      modalMessage
    } = this.state;
    return (
      <>
        <ReactModal
          reactModalVisible={reactModalVisible}
          submitModal={this.submitModal}
          modalMessage={modalMessage}
          requireCancel={requireCancel}
        />
        {editMode ? (
          <UserEdit
            user={user}
            toggleEditMode={this.toggleEditMode}
            onUpdateUser={this.onUpdateUser}
          />
        ) : (
          <UserView user={user} toggleEditMode={this.toggleEditMode} />
        )}
        {accessSpecifier &&
        accessSpecifier[USER_ROLES_FEATURE_ID] &&
        !accessSpecifier[USER_ROLES_FEATURE_ID].viewP ? null : (
          <UserDetails
            user={user}
            accessSpecifier={accessSpecifier[USER_ROLES_FEATURE_ID]}
          />
        )}
      </>
    );
  }
}

// UserProfile.getInitialProps = ({ router }) => {
//   return { router };
// };

export default withRouter(withApollo(UserProfile));
