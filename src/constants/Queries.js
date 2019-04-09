module.exports = {
  CREATE_SESSION: "INSERT INTO session(account_id,session_token,expiry_date) VALUES ($1,$2,NOW() AT TIME ZONE 'utc' + interval '15 minute') RETURNING session_token as token",
  TERMINATE_SESSION: "DELETE FROM session WHERE session_token=$1",
  FIND_SESSION_BY_TOKEN: "SELECT * FROM session WHERE session_token=$1 AND expiry_date >= NOW() AT TIME ZONE 'utc'",
  DELETE_EXPIRED_SESSIONS: "DELETE FROM session WHERE expiry_date < NOW() AT TIME ZONE 'utc'",

  FIND_ACCOUNT_BY_EMAIL: "SELECT id, password, salt FROM account where email=$1",
  FIND_ACCOUNT_BY_SESSION_TOKEN: "SELECT a.* FROM account a join session s on a.id = s.account_id where s.session_token=$1",
  CHANGE_PASSWORD: "UPDATE account SET password=$1,salt=$2 WHERE id=$3",
  CREATE_ACCOUNT: "INSERT INTO account(email,password,salt) VALUES ($1,$2,$3) RETURNING id,email,created_date",

  CREATE_PROFILE: "INSERT INTO profile(account_id, name) VALUES ($1, $2) RETURNING id,name",
  GET_PROFILES: "SELECT * FROM profile WHERE account_id=$1",
  GET_PROFILE: "SELECT * FROM profile WHERE account_id=$1 AND id=$2",
  UPDATE_PROFILE: "UPDATE profile SET name=$1 WHERE id=$2",
  DELETE_PROFILE: "DELETE FROM profile WHERE id=$1",

  CREATE_TRANSACTION: "INSERT INTO transaction(profile_id, date, description, category_id, subcategory_id, institution_id, amount) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
  GET_TRANSACTIONS: "SELECT * FROM transaction WHERE profile_id=$1",
  GET_TRANSACTION: "SELECT * FROM transaction WHERE profile_id=$1 AND id=$2",
  UPDATE_TRANSACTION: "UPDATE transaction SET profile_id=$1, date=$2, description=$3, category_id=$4, subcategory_id=$5, institution_id=6, amount=$7 WHERE id=$2",
  DELETE_TRANSACTION: "DELETE FROM transaction WHERE id=$1"

}