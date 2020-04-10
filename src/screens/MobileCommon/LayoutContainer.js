import { connect } from "react-redux";

import Layout from "./Layout";

function mapStateToProps(state) {
  return { userName: state.auth.userName };
}

export default connect(mapStateToProps)(Layout);
