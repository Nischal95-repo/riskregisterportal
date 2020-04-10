//https://www.apollographql.com/docs/react/essentials/mutations.html
import { gql } from "apollo-boost";

export const getDocumnetListQuery = gql`
  query($offset: Int, $pageNo: Int, $documentId: Int, $title: String, $status: Int $categoryId: Int) {
    getListOfDocuments(
      noOfRows: $offset
      offset: $pageNo
      documentId: $documentId
      title: $title
      status: $status
      categoryId: $categoryId
    ) {
      Id
      title
      categoryDetail{
        Id
        description
      }
      description
      projectDetail {
        Id
        description
        masterFor
      }
      companyDetail {
        Id
        description
      }
      statusDetail {
        Id
        name
        statusId
      }
      isReportingManager {
        isReportingManager
      }
      lastModifiedOn
    }
  }
`;

export const getDocumentById = gql`
  query($id: Int!) {
    getDocumentById(id: $id) {
      Id
      title
      categoryDetail{
        Id
        description
      }
      companyDetail {
        Id
        description
      }
      projectDetail {
        Id
        description
      }
      comments
      typeId
      createdOn
      createdBy
      createdByDetail {
        Id
        loginId
      }
      lastModifiedOn
      lastModifiedBy
      modifiedByDetail {
        Id
        loginId
      }
      description
      reviewStartDate
      reviewEndDate
      approvedOn
      approvedBy
      approvedByDetail {
        loginId
      }
      status
      statusDetail {
        Id
        name
      }
      isReportingManager {
        isReportingManager
      }
    }
  }
`;

export const createDocument = gql`
  mutation(
    $title: String!
    $companyId: Int!
    $categoryId: Int!
    $typeId: Int!
    $projectId: Int!
    $description: String!
    $reviewStartDate: Date!
    $reviewEndDate: Date!
  ) {
    createDocument(
      data: {
        title: $title
        companyId: $companyId
        categoryId: $categoryId
        typeId: $typeId
        projectId: $projectId
        description: $description
        reviewStartDate: $reviewStartDate
        reviewEndDate: $reviewEndDate
      }
    ) {
      document {
        Id
        title
      }
    }
  }
`;

export const updateDocument = gql`
  mutation(
    $id: Int!
    $title: String!
    $categoryId: Int!
    $companyId: Int!
    $typeId: Int!
    $projectId: Int!
    $description: String!
    $reviewStartDate: Date!
    $reviewEndDate: Date!
    $status: Int!
  ) {
    updateDocument(
      id: $id
      data: {
        title: $title
        categoryId: $categoryId
        companyId: $companyId
        typeId: $typeId
        projectId: $projectId
        description: $description
        reviewStartDate: $reviewStartDate
        reviewEndDate: $reviewEndDate
        status: $status
      }
    ) {
      message
    }
  }
`;

export const getListofProjectsByCompanyId = gql`
  query($companyId: Int) {
    getListOfProjectsByCompanyId(companyId: $companyId) {
      projectDetail {
        Id
        description
      }
    }
  }
`;

export const addReviewers = gql`
  mutation($userId: [Int]!, $documentId: Int!) {
    addReviewers(data: { userId: $userId, documentId: $documentId }) {
      reviewers {
        Id
        userId
      }
    }
  }
`;

export const getReviewersListQuery = gql`
  query($documentId: Int!) {
    getListOfReviewers(documentId: $documentId) {
      Id
      userId
      documentId
      userDetail {
        Id
        name
        emailId
        employeeId
      }
    }
  }
`;

export const removeReviewers = gql`
  mutation($id: String!) {
    removeReviewers(id: $id) {
      message
    }
  }
`;

export const getListOfVersionsQuery = gql`
  query($documentId: Int!, $status: [Int]) {
    getListOfVersionsByDocumentId(documentId: $documentId, status: $status) {
      Id
      versionNo
      documentId
      status
      reviewStartDate
      reviewEndDate
      final
      reviewerStatusDetail{
        isReviewCompleted
      }
      statusDetail {
        Id
        name
      }
    }
  }
`;

export const updateVersionQuery = gql`
  mutation(
    $id: String!
    $reviewStartDate: Date!
    $reviewEndDate: Date!
    $status: Int!
    $final: Boolean!
  ) {
    updateVersion(
      id: $id
      data: {
        reviewStartDate: $reviewStartDate
        reviewEndDate: $reviewEndDate
        status: $status
        final: $final
      }
    ) {
      message
    }
  }
`;

export const changeDocumentStatusQuery = gql`
  mutation($id: Int!, $status: Int!, $comments: String) {
    changeDocumentStatus(id: $id, status: $status, comments: $comments) {
      message
    }
  }
`;

export const getListOfAttachmentsQuery = gql`
  query($documentId: Int!, $versionId: String!) {
    getListOfAttachmentsByVersionId(
      documentId: $documentId
      versionId: $versionId
    ) {
      Id
      versionId
      documentId
      url
      attachmentURL {
        signedUrl
      }
      msgRead
      isDownloadable
      versionDetail{
        status
        reviewStartDate
        reviewEndDate
      }
    }
  }
`;
// attachmentURL{
//   signedUrl
// }

export const createAttachmentQuery = gql`
  mutation(
    $documentId: Int!
    $versionId: String!
    $data: [CreateAttachmentInputType]!
  ) {
    createAttachment(
      documentId: $documentId
      versionId: $versionId
      data: $data
    ) {
      version {
        Id
      }
    }
  }
`;

export const deleteAttachmentQuery = gql`
  mutation($attachmentId: String!, $versionNo: Int!) {
    deleteAttachment(attachmentId: $attachmentId, versionNo: $versionNo) {
      message
    }
  }
`;

export const downloadAttachmentQuery = gql`
  mutation($attachmentId: String!, $versionNo: Int!) {
    downloadAttachment(attachmentId: $attachmentId, versionNo: $versionNo) {
      fileData
      fileName
    }
  }
`;

// Review

export const getListOfDocumentsForReviewQuery = gql`
  query($offset: Int, $pageNo: Int, $documentId: Int, $title: String, $status: Int $categoryId: Int) {
    getListOfDocumentsForReview(
      noOfRows: $offset
      offset: $pageNo
      documentId: $documentId
      title: $title
      status: $status
      categoryId: $categoryId
    ) {
      Id
      title
      categoryDetail{
        Id
        description
      }
      description
      projectDetail {
        Id
        description
        masterFor
      }
      companyDetail {
        Id
        description
      }
      statusDetail {
        Id
        name
        statusId
      }
      isReportingManager {
        isReportingManager
      }
    }
  }
`;

export const reviewCompletedQuery = gql`
  mutation($versionId: String!, $versionNo: Int!, $isFinal: Boolean!) {
    reviewCompleted(
      versionId: $versionId
      versionNo: $versionNo
      isFinal: $isFinal
    ) {
      message
    }
  }
`;

export const updateVersionReviewDetailQuery = gql`
  mutation(
    $documentId: Int!
    $versionId: String!
    $isReviewCompleted: Boolean!
  ) {
    createVersionReview(
      data: {
        documentId: $documentId
        versionId: $versionId
        isReviewCompleted: $isReviewCompleted
      }
    ) {
      detail {
        Id
      }
    }
  }
`;

export const AditionalInfo = gql`
  mutation($attachmentId: String!, $seekInformation: String!) {
    createAttachmentReviewDetail(
      data: { attachmentId: $attachmentId, seekInformation: $seekInformation }
    ) {
      attachmentDetail {
        Id
      }
    }
  }
`;

export const getAttachmentReviewDetail = gql`
  query($attachmentId: String!, $reviewer: Boolean!) {
    getAttachmentReviewDetail(
      attachmentId: $attachmentId
      isReviewer: $reviewer
    ) {
      seekInformation
      createdOn
      userDetail {
        name
      }
    }
  }
`;

export const updateMsgRead = gql`
  mutation($attachmentId: String!) {
    updateMsgRead(attachmentId: $attachmentId) {
      message
    }
  }
`;

export const updateIsDownloadable = gql`
  mutation($attachmentId: String! $isDownload: Boolean!) {
    updateIsDownloadable(attachmentId: $attachmentId isDownload: $isDownload) {
      message
    }
  }
`;

export const getVersionReviewDetail = gql`
  query($versionId: String!) {
    getVersionReviewDetail(versionId: $versionId) {
      userDetail {
        name
        employeeId
      }
      versionId
      modifiedOn
    }
  }
`;

// Info

export const getInfoListQuery = gql`
  query($offset: Int, $pageNo: Int, $documentId: Int, $status: Int $categoryId: Int) {
    getListOfInfoDocuments(
      noOfRows: $offset
      offset: $pageNo
      documentId: $documentId
      status: $status
      categoryId: $categoryId
    ) {
      Id
      title
      categoryDetail{
        Id
        description
      }
      description
      projectDetail {
        Id
        description
        masterFor
      }
      companyDetail {
        Id
        description
      }
      statusDetail {
        Id
        name
        statusId
      }
    }
  }
`;

export const getInfoById = gql`
  query($id: Int!) {
    getInfoDocumentById(id: $id) {
      Id
      title
      categoryDetail{
        Id
        description
      }
      companyDetail {
        Id
        description
      }
      projectDetail {
        Id
        description
      }
      typeId
      createdOn
      createdBy
      createdByDetail {
        Id
        loginId
      }
      lastModifiedOn
      lastModifiedBy
      modifiedByDetail {
        Id
        loginId
      }
      description
      status
      statusDetail {
        Id
        name
      }
    }
  }
`;

export const createInfo = gql`
  mutation(
    $title: String!
    $companyId: Int!
    $categoryId: Int!
    $typeId: Int!
    $projectId: Int!
    $description: String!
  ) {
    createDocumentInfo(
      data: {
        title: $title
        companyId: $companyId
        categoryId: $categoryId
        typeId: $typeId
        projectId: $projectId
        description: $description
      }
    ) {
      document {
        Id
        title
      }
    }
  }
`;

export const updateInfo = gql`
  mutation(
    $id: Int!
    $title: String!
    $categoryId: Int!
    $companyId: Int!
    $typeId: Int!
    $projectId: Int!
    $description: String!
    $status: Int!
  ) {
    updateDocumentInfo(
      id: $id
      data: {
        title: $title
        categoryId: $categoryId
        companyId: $companyId
        typeId: $typeId
        projectId: $projectId
        description: $description
        status: $status
      }
    ) {
      message
    }
  }
`;

export const getListOfInfoAttachmentsQuery = gql`
  query($documentId: Int!) {
    getListOfInfoAttachmentsByDocumentId(
      documentId: $documentId
    ) {
      Id
      documentId
      url
    }
  }
`;

export const createInfoAttachmentQuery = gql`
  mutation(
    $documentId: Int!
    $data: [CreateInfoAttachmentInputType]!
  ) {
    createInfoAttachment(
      documentId: $documentId
      data: $data
    ) {
      attachment{
        Id
      }
    }
  }
`;

export const downloadInfoAttachmentQuery = gql`
  mutation($attachmentId: String!) {
    downloadInfoAttachment(attachmentId: $attachmentId) {
      fileData
      fileName
    }
  }
`;

export const deleteInfoAttachmentQuery = gql`
  mutation($attachmentId: String!) {
    deleteInfoAttachment(attachmentId: $attachmentId) {
      message
    }
  }
`;

export const getListofInfoForViewQuery = gql`
  query($offset: Int, $pageNo: Int, $documentId: Int, $status: Int $categoryId: Int) {
    getListOfInfoDocumentsForReview(
      noOfRows: $offset
      offset: $pageNo
      documentId: $documentId
      status: $status
      categoryId: $categoryId
    ) {
      Id
      title
      categoryDetail{
        Id
        description
      }
      description
      projectDetail {
        Id
        description
        masterFor
      }
      companyDetail {
        Id
        description
      }
      statusDetail {
        Id
        name
        statusId
      }
    }
  }
`;

export const addInfoReviewers = gql`
  mutation($userId: [Int]!, $documentId: Int!) {
    addInfoReviewers(data: { userId: $userId, documentId: $documentId }) {
      reviewers {
        Id
        userId
      }
    }
  }
`;

export const getInfoReviewersListQuery = gql`
  query($documentId: Int!) {
    getListOfInfoReviewers(documentId: $documentId) {
      Id
      userId
      documentId
      userDetail {
        Id
        name
        emailId
        employeeId
      }
    }
  }
`;

export const removeInfoReviewers = gql`
  mutation($id: String!) {
    removeInfoReviewers(id: $id) {
      message
    }
  }
`;