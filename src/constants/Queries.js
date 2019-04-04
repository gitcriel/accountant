module.exports = {
  CREATE_SESSION: "INSERT INTO session(account_id,session_token,expiry_date) VALUES ($1,$2,NOW() AT TIME ZONE 'utc' + interval '15 minute') RETURNING session_token as token",
  TERMINATE_SESSION: "DELETE FROM session WHERE session_token=$1",
  FIND_SESSION_BY_TOKEN: "SELECT * FROM session WHERE session_token=$1 AND expiry_date >= NOW() AT TIME ZONE 'utc'",
  DELETE_EXPIRED_SESSIONS: "DELETE FROM session WHERE expiry_date < NOW() AT TIME ZONE 'utc'",

  FIND_ACCOUNT_BY_EMAIL: "SELECT id, password, salt FROM account where email=$1",
  FIND_ACCOUNT_BY_SESSION_TOKEN: "SELECT a.* FROM account a join session s on a.id = s.account_id where s.session_token=$1",
  CHANGE_PASSWORD: "UPDATE account SET password=$1,salt=$2 WHERE id=$3",
  CREATE_ACCOUNT: "INSERT INTO account(email,password,salt) VALUES ($1,$2,$3) RETURNING id,email,created_date"
}