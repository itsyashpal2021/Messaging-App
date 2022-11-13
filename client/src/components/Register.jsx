export function RegisterForm(props) {
  return (
    <div className="conatiner-fluid">
      <div className="row justify-content-center">
        <input
          type="text"
          name="firstName"
          className="form-control-lg col-4 m-3"
          placeholder="First Name"
        />
        <input
          type="text"
          name="lastName"
          className="form-control-lg col-4 m-3"
          placeholder="Last Name"
        />
      </div>
      <div className="row justify-content-center">
        <input
          type="email"
          name="firstName"
          className="form-control-lg col-4 m-3"
          placeholder="Email Id"
        />
        <div className="col-4 m-3 d-flex">
          <div className="me-5 py-3">
            <label htmlFor="genderMale" className="fs-5">
              Male
            </label>
            <input type="radio" id="genderMale" className="m-1" />
          </div>
          <div className="py-3">
            <label htmlFor="genderFemale" className="fs-5">
              Female
            </label>
            <input type="radio" id="genderFemale" className="m-1" />
          </div>
        </div>
      </div>
      <div className="row justify-content-center">
        <input
          type="password"
          name="password"
          className="form-control-lg col-4 m-3"
          placeholder="Password"
        />
        <input
          type="password"
          name="confirmPassword"
          className="form-control-lg col-4 m-3"
          placeholder="Confirm Password"
        />
      </div>
      <div className="row justify-content-center">
        <button type="submit" class="btn btn-success col-5 fs-4 mt-3">
          Register
        </button>
      </div>
    </div>
  );
}
