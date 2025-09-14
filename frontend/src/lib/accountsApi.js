import { req, qs } from "./http.js";
const AccountsApi = {
  list({ page = 0, size = 10, q, role, active } = {}) {
    return req("GET", `/api/accounts${qs({ page, size, q, role, active })}`);
  },
  get(id) {
    if (id == null) throw new Error("Thiếu ID tài khoản");
    return req("GET", `/api/accounts/${id}`);
  },
  create(payload) {
    return req("POST", `/api/accounts`, payload);
  },
  update(id, payload) {
    if (id == null) throw new Error("Thiếu ID tài khoản để cập nhật");
    return req("PUT", `/api/accounts/${id}`, payload);
  },
  delete(id) {
    if (id == null) throw new Error("Thiếu ID tài khoản để xoá");
    return req("DELETE", `/api/accounts/${id}`);
  },
  resetPassword(id, newPassword) {
    if (id == null) throw new Error("Thiếu ID tài khoản để reset mật khẩu");
    return req("POST", `/api/accounts/${id}/reset-password`, {
      new_password: newPassword,
    });
  },
};

export default AccountsApi;
