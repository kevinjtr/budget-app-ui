import createRestBundle from "./create-rest-bundle";

export default createRestBundle({
  name: "accessRequest",
  uid: "id",
  prefetch: true,
  staleAfter: 30000,
  persist: false,
  routeParam: null,
  allowRoles: [":ORG.ADMIN"],
  getTemplate: "/orgs/:orgSlug/access",
  putTemplate: "/orgs/:orgSlug/access/:item.id",
  postTemplate: "/orgs/:orgSlug/access/:item.id",
  bulkPostTemplate:"",
  deleteTemplate: "/orgs/:orgSlug/access/:item.id",
  fetchActions: ["URL_UPDATED", "AUTH_LOGGED_IN"],
  forceFetchActions: [
    "ACCESSREQUEST_SAVE_FINISHED",
    "ACCESSREQUEST_DELETE_FINISHED"
  ],
  addons: {
    doAccessRequestAccept: (request, roleId) => ({ store }) => {
      const newUser = {
        dateCreated: new Date(),
        id: "new",
        revoked: false,
        userName: request.userName,
        userNumber: request.usersId
      };
      request.users_id=request.usersId;
      request.add_roles_id=roleId;
      store.doOrgRolesChange(newUser, roleId, false);
      store.doAccessRequestSave(request);
    }
  }
});
