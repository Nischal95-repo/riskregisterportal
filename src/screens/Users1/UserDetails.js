import React from "react";
import equal from 'fast-deep-equal';
import SimpleReactValidator from "simple-react-validator";

import { getListofUserRolesQuery, addUserRolesQuery, removeUserRoleQuery, getListofRolesQuery } from "../../services/graphql/queries/user";
import {withApollo} from "react-apollo";

import SelectComponent from "../Common/form-component/SelectComponent";
import ReactModal from "../Common/ReactModal";
import DisplayErrors from "../Common/DisplayErrors";

import { SET_TIMEOUT_VALUE, DO_NOT_ACCESS_MESSAGE } from "../../constants/app-constants";

import { errorMessage } from "../../miscellaneous/error-messages";


class UserDetails extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      errors: [],
      userRoles:[],
      roles:[],
      rolesDetail:{
        roleId:''
      },
      rolesOption:[],
      reactModalVisible: false,
      requireCancel: false,
      modalMessage: DO_NOT_ACCESS_MESSAGE
    };
    this.validator = new SimpleReactValidator({
      autoForceUpdate: this,
      element: message => <div style={{ color: "red" }}>{message}</div>
    });
    this.handleInput = this.handleInput.bind(this);
    this.addRole = this.addRole.bind(this);
  }

  delete(id) {
    if (this.props.accessSpecifier.deleteP) {
      this.setState({
        reactModalVisible: true,
        requireCancel: true,
        modalMessage: "Are you sure you want to delete",
        deleteId: id
      });
    } else {
      this.setState({
        reactModalVisible: true,
        requireCancel: false,
        modalMessage: "You dont have permission to do this Action"
      });
    }
  }

  onOkClicked() {
    this.setState({ reactModalVisible: false });
    if (this.props.accessSpecifier.deleteP && this.state.deleteId) {
      this.removeUserRole(this.state.deleteId)
    }
  }

  onCancelClicked() {
    this.setState({ reactModalVisible: false });
  }

  getListOfUserRoles(){
    this.setState({loading: true});
    this.props.client
      .query({
        query: getListofUserRolesQuery,
        variables: {
          userId: this.props.user.Id
        },
        fetchPolicy: "network-only"
      })
      .then(result => {
        var userRoles = result.data.userRoles; 
        userRoles = JSON.parse(userRoles);
        this.initialState = {
          userRoles: userRoles
        };
        this.setState({ ...this.initialState, loading: false, error: "" });
      })
      .catch(error => {
        this.setState({ loading: false, error: error.message });
      });
  }

  removeUserRole(id){
    this.props.client
      .mutate({
        mutation: removeUserRoleQuery,
        variables: {id},
        fetchPolicy: "no-cache"
      })
      .then(result => {
        this.getListOfUserRoles();
      })
      .catch(error => {
        console.log("~~~error: ", error);
        this.setState({ loading: false, error: error.message });
      });
  }

  addMode(){
    if (this.props.accessSpecifier.createP){
      document.getElementById("addDiv1").style.display = "block";
      document.getElementById("showlistDiv1").style.display = "none";
    }else{
      this.setState({
        reactModalVisible: true,
        requireCancel: false,
        deleteId: "",
        modalMessage: "You dont have permission to do this Action"
      });
    }
  }

  listMode(){
    document.getElementById("addDiv1").style.display = "none";
    document.getElementById("showlistDiv1").style.display = "block";
    
    this.state.rolesDetail.roleId = '';
    this.setState({errors:[]});
  }

  getListOfRoles(){
    console.log("!!!!!!!!!!!!!!!",this.props.user.lockedDetail.entityType)
    this.props.client
      .query({
        query: getListofRolesQuery,
        variables: {
          entityType:this.props.user.lockedDetail.entityType
        },
        fetchPolicy: "network-only"
      })
      .then(result => {
        var roles = result.data.roles;
        this.initialState = {
          rolesOption: roles
        };
        this.setState({ ...this.initialState, loading: false, error: "" });
      })
      .catch(error => {
        this.setState({ loading: false, error: error.message });
      });
  }

  handleInput(e) {
    let value = e.target.value;
    let name = e.target.name;
    this.setState(prevState => {
      return {
        rolesDetail: {
          ...prevState.rolesDetail,
          [name]: value
        }
      };
    });
  }

  addRole(e){
    e.preventDefault();
      if(this.validator.allValid()){
        this.props.client
      .mutate({
        mutation: addUserRolesQuery,
        variables: {userId: parseInt(this.props.user.userId), roleId: this.state.rolesDetail.roleId },
        fetchPolicy: "no-cache"
      })
      .then(result => {
        this.state.rolesDetail.roleId = '';
        this.getListOfUserRoles();
        this.listMode();
      })
      .catch(error => {
        console.log("~~~error: ", error);
        this.setState({ loading: false, errors: [errorMessage(error)] });
        this.timer = setTimeout(() => {
          this.setState({ errors: [] });
        }, SET_TIMEOUT_VALUE);
      });
      } else{
        this.validator.showMessages();
        // rerender to show messages for the first time
        // you can use the autoForceUpdate option to do this automatically`
        this.forceUpdate();
      }
  }

  onClearClicked(){
    this.state.rolesDetail.roleId = '';
    this.setState({});
  }

  componentDidMount(){
    console.log("!!!!!!!!!!!!!!!!!!!!!!!")
    
  }

  componentDidUpdate(prevProps) {
    if(!equal(this.props.user, prevProps.user))
    {
      this.getListOfUserRoles();
      this.getListOfRoles();
      
    }
  }

  render() {
    const { loading, errors, userRoles, rolesDetail, rolesOption,              reactModalVisible, requireCancel, modalMessage } = this.state;
    return (
      <div className="tab-style-1">
        <div className="nav flex-column nav-pills" id="v-pills-tab" role="tablist" aria-orientation="vertical">
          <a className="nav-link active" id="role-tab" data-toggle="pill" href="#role" role="tab" aria-controls="role" aria-selected="false"><span>Roles</span></a>
        </div>
        <div className="tab-content" id="v-pills-tabContent">
          <div className="tab-pane fade show active" id="role" role="tabpanel" aria-labelledby="role-tab">
            {/* Sales Section End */}
            <div className="box-card">
              <div className="row">
                <div className="col-md-12">
                  <div id="addDiv1" style={{display: 'none'}}>
                    <div className="row align-items-center">
                      <div className="col-md-10">
                        <h1 className="heading m-b-0">Add Roles</h1>
                        <div
                          className="row"
                          style={{
                            display: errors.length === 0 ? "none" : "block"
                          }}
                        >
                          <div className="col-md-6">
                            <div className="alert alert-success" role="alert">
                              <div className="row">
                                <span className="danger-link">
                                  <DisplayErrors errors={errors} />
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-2 text-right">
                        <a href="#" onClick={()=>this.listMode()} className="link-click">
                          <svg x="0px" y="0px" width="16px" height="16px" viewBox="0 0 16 16" enableBackground="new 0 0 16 16" xmlSpace="preserve">
                            <g>
                              <line fill="none" stroke="#69951a" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit={10} x1="3.25" y1="3.25" x2="12.75" y2="12.75" />
                              <line fill="none" stroke="#69951a" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit={10} x1="12.75" y1="3.25" x2="3.25" y2="12.75" />
                            </g>
                          </svg>
                          Close</a>
                      </div>
                    </div>
                    <form onSubmit={this.addRole}>
                    <div className="row mt-3">
                      <div className="col-md-12 col-lg-10">
                        <div className="row">
                          <div className="col-md-12 col-lg-4">
                            <div className="form-group">
                            <SelectComponent
                              label={"Role Name"}
                              title={"roleName"}
                              name={"roleId"}
                              options={rolesOption}
                              optionKey={"roleName"}
                              valueKey={"Id"}
                              value={rolesDetail.roleId}
                              placeholder={"Select Role"}
                              handleChange={this.handleInput}
                              validator={this.validator}
                              validation="required"
                            />
                            </div>
                          </div>
                        </div>
                        <div className="col-md-12 col-lg-10">
                          <div className="row">
                            {/* removed  m-t-45,  m-b-15*/}
                            <div className="col-md-12 ">
                              <button type="submit" className="btn btn-danger" >
                                Submit
                              </button>
                              {/* Changed btn-danger*/}
                              <button type="button" className="btn btn-light m-l-50" onClick={()=>this.onClearClicked()}>
                                Clear
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    </form>
                  </div>
                  <div className="p-t-0" id="showlistDiv1">
                    <div className="row align-items-center">
                      <div className="col-md-10">
                        <h1 className="heading m-b-0">Roles List View</h1>
                      </div>
                      <div className="col-md-2 text-right">
                        <a href="#" onClick={()=>this.addMode()} className="link-click">
                          <svg x="0px" y="0px" width="16px" height="16px" viewBox="0 0 16 16" enableBackground="new 0 0 16 16" xmlSpace="preserve">
                            <g>
                              <circle fill="none" stroke="#69951a" strokeLinecap="round" strokeLinejoin="round" cx={8} cy={8} r="7.5" />
                              <g>
                                <line fill="none" stroke="#69951a" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit={10} x1="2.5" y1={8} x2="13.5" y2={8} />
                                <line fill="none" stroke="#69951a" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit={10} x1={8} y1="2.5" x2={8} y2="13.5" />
                              </g>
                            </g>
                          </svg> Add
                        </a>
                      </div>
                    </div>
                    {/* <div className="alert alert-success p-0 m-t-10 m-b-0" role="alert">
                      <svg x="0px" y="0px" width="16px" height="16px" viewBox="0 0 16 16">
                        <g transform="translate(0, 0)">
                          <path fill="none" stroke="#8dc43f" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit={10} d="M13.423,6.999 C13.474,7.325,13.5,7.66,13.5,8c0,3.59-2.91,6.5-6.5,6.5S0.5,11.59,0.5,8S3.41,1.5,7,1.5c1.082,0,2.102,0.264,3,0.732" data-cap="butt" />
                          <polyline fill="none" stroke="#8dc43f" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit={10} points="4,6.5 7,9.5 15,1.5 " data-cap="butt" data-color="color-2" />
                        </g>
                      </svg>
                      <span className="success-link"> Success</span>
                    </div> */}
                    {/* Table Section Start */}
                    <div className="table-responsive">
                      <table className="table table-style-1 m-t-35">
                        <thead>
                          <tr>
                            <th scope="col" width={250}>ROLE NAME</th>
                            <th scope="col" width={200}>ACTION</th>
                          </tr>
                        </thead>
                        <tbody>
                          {userRoles.length ?
                          userRoles.map((data,index)=>{
                            return (
                            <tr key={index}>
                              <td>{data.roleName && data.roleName.roleName? data.roleName.roleName : null}</td>
                              <td>
                                <a href="#" className="link-delete m-l-45" data-toggle="tooltip" data-placement="bottom" title="Delete" onClick={()=>this.delete(data._id)}>
                                  <svg x="0px" y="0px" width="16px" height="16px" viewBox="0 0 16 16">
                                    <g transform="translate(0, 0)">
                                      <path fill="none" stroke="#69951a" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit={10} d="M2.5,6.5v7 c0,1.105,0.895,2,2,2h8c1.105,0,2-0.895,2-2v-7" />
                                      <line data-color="color-2" fill="none" stroke="#69951a" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit={10} x1="1.5" y1="3.5" x2="15.5" y2="3.5" />
                                      <polyline data-color="color-2" fill="none" stroke="#69951a" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit={10} points=" 6.5,3.5 6.5,0.5 10.5,0.5 10.5,3.5 " />
                                      <line fill="none" stroke="#69951a" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit={10} x1="8.5" y1="7.5" x2="8.5" y2="12.5" />
                                      <line fill="none" stroke="#69951a" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit={10} x1="11.5" y1="7.5" x2="11.5" y2="12.5" />
                                      <line fill="none" stroke="#69951a" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit={10} x1="5.5" y1="7.5" x2="5.5" y2="12.5" />
                                    </g>
                                  </svg>
                                </a>
                              </td>
                            </tr>)
                          }):null}
                        </tbody>
                      </table>
                      {!loading && !userRoles.length ? <div className="text-center" style={{fontWeight:'bold'}}>No Data</div> : null}
                    </div>
                    {/* Table Section End */}
                    {/* Pagination Start */}
                    {/* <nav aria-label="Page navigation example">
                      <ul className="pagination justify-content-center pagination-style-1">
                        <li className="page-item">
                          <a className="page-link" href="#" aria-label="Previous" id="page">« Previous
                          </a>
                        </li>
                        <li className="page-item">
                          <a className="page-link" href="#" aria-label="Next" id="page">
                            Next »
                          </a>
                        </li>
                      </ul>
                    </nav> */}
                    {/* Pagination End */}
                  </div>
                  {/* Sales Section End */}
                </div>
              </div>
            </div>
          </div>
        </div>
        <ReactModal
          reactModalVisible={reactModalVisible}
          submitModal={this.onOkClicked.bind(this)}
          closeModal={this.onCancelClicked.bind(this)}
          modalMessage={modalMessage}
          requireCancel={requireCancel}
        />
      </div>
    );
  }
}

export default withApollo(UserDetails);