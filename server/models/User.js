import mongoose, {mongo} from "mongoose";

const UserSchema = new mongoose.Schema(
    {
        email: {type: String, required: true, unique: true},
        password: {type: String, required: true, minLength: 5},
        // name: {type: String, required: true},
        // image: {type: String},
        // phone: {type: String, default: ""},
        // address: {
        //     city: {type: String, default: ""},
        //     street: {type: String, default: ""},
        //     unit: {type: String, default: ""},
        //     zip: {type: String, default: ""},
        // },
         admin: {type: Boolean, required: true, default: false},
        // username: {type: String, default: ""},
        refesh_token: String,
    },
    {timestamps: true}
);

const User = mongoose.model("User", UserSchema);
export default User;
