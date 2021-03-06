ManageProfile = React.createClass({
  	mixins: [ReactMeteorData],
  	getMeteorData() {
    	return {
      		user: Meteor.user()
    	}
  	},
    checkEmailIsValid (aString) {
        aString = aString || '';
        return aString.length > 1 && aString.indexOf('@') > -1;
    },
    checkPasswordIsValid(aString) {
        aString = aString || '';
        return aString.length > 7;
    },
    checkPhoneIsValid(aString){
      var phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
      if (phoneRegex.test(aString)) {
        return true;
      } else {
        return false;          // Invalid phone number
      }
    },
    changePassword: function(event){
    event.preventDefault();
    let oldPassword =$('[name="oldPassword"]').val(),
          newPassword =$('[name="newPassword1"]').val(),
          confirmPassword =$('[name="newPassword2"]').val();

    oldPassword = oldPassword.replace(/^\s*|\s*$/g, '');
    newPassword = newPassword.replace(/^\s*|\s*$/g, '');
    confirmPassword = confirmPassword.replace(/^\s*|\s*$/g, '');

    let isValidPassword = this.checkPasswordIsValid(newPassword);
    if(!isValidPassword){
      Bert.alert('Your new password is invalid. Please try another one.', 'warning')
      return;
    }else{
      //valid password, now check match
      if(newPassword != confirmPassword){
        Bert.alert('Your passwords do not match. Please try again.')
      }else{
        Accounts.changePassword(oldPassword, newPassword, function(error, result){
          if(error){
            Bert.alert('There was an error changing your password:' + error.reason, 'warning');
          }else{
            Bert.alert('Your password was updated successfully.');
            FlowRouter.go('/routes');
          }
        });
      }  
    }
  },

    handleSubmit( event ) {
		event.preventDefault();
		let firstName =$('[name="firstName"]').val(),
	        lastName =$('[name="lastName"]').val(),
	        phoneNumber =$('[name="phoneNumber"]').val();

      
      let isValidPhone = this.checkPhoneIsValid(phoneNumber);

      // simple validation & messaging
      if(!isValidPhone){
          Bert.alert('Please enter a valid phone number.', 'warning')
          return;
      }
      if(lastName==''){
        Bert.alert('Please enter your last name.', 'warning');
        return;
      }
      if(firstName==''){
        Bert.alert('Please enter your first name.', 'warning');
        return;
      }
      Meteor.call('updateProfile', Meteor.user()._id, firstName, lastName, phoneNumber, function(error, result){
        if(error){
          Bert.alert('There was an error updating your information:' + error.reason, 'warning');
        }else{
          Bert.alert('Your information was updated successfully.');
          FlowRouter.go('/routes');
        }

      });

    },
    
    render() {
        return (
        <div>  
          <span> 
            <div className="row">
              <div className="col-xs-12 col-sm-6 col-md-4">
                <h4 className="page-header">Update Profile</h4>
                <form id="signup" className="signup" onSubmit={this.handleSubmit}>
                  <div className="form-group">
                    <input type="email" name="emailAddress" className="form-control" disabled value={Meteor.user().emails[0].address}/>
                  </div>
                  <div className="form-group">
                    <input type="text" name="firstName" className="form-control" defaultValue={Meteor.user().profile? Meteor.user().profile.firstName: ''}/>
                  </div>
                  <div className="form-group">
                    <input type="text" name="lastName" className="form-control" defaultValue={Meteor.user().profile? Meteor.user().profile.lastName :''}/>
                  </div>
                  <div className="form-group">
                    <input type="text" name="phoneNumber" className="form-control" defaultValue={Meteor.user().profile? Meteor.user().profile.phoneNumber : ''} />
                  </div>
                  <div className="form-group">
                    <input type="submit" className="button" value="Update My Info" />
                  </div>
                </form>
              </div>  
            </div>
          </span>
          <span>
            <div>
              <div className="col-xs-12 col-sm-6 col-md-4">
                <h4 className="page-header">Change Password</h4>
              </div>
              <form id="signup" className="signup" onSubmit={this.changePassword}>
                <div className="form-group">
                  <input type="password" name="oldPassword" className="form-control" placeholder='Old Password' />
                </div>
                <div className="form-group">
                  <input type="password" name="newPassword1" className="form-control" placeholder='New Password' />
                </div>
                <div className="form-group">
                  <input type="password" name="newPassword2" className="form-control" placeholder='Confirm Password' />
                </div>
                <div className="form-group">
                  <input type="submit" className="button" value="Change Password" />
                </div>
              </form>
            </div>
          </span>
        </div>
      	);
    }
});