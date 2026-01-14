import CommonForm from "@/components/common/form";
import { useToast } from "@/components/ui/use-toast";
import { loginFormControls } from "@/config";
import { loginUser, checkAuth, checkAdminAccess } from "@/store/auth-slice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";

const initialState = {
  email: "",
  password: "",
};

function AuthLogin() {
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  // 👇 fallback to homepage if no previous page was saved
  const from = location.state?.from || "/";

  async function onSubmit(event) {
    event.preventDefault();

    try {
      const loginResult = await dispatch(loginUser(formData)).unwrap();
      
      if (loginResult?.success) {
        // ✅ Refresh auth state
        const authResult = await dispatch(checkAuth()).unwrap();
        
        // ✅ Check admin access if authenticated
        if (authResult?.success) {
          await dispatch(checkAdminAccess()).catch(() => {
            // User is not admin, that's fine
          });
        }
        
        toast({
          title: loginResult?.message,
        });
        
        navigate(from, { replace: true });
      } else {
        toast({
          title: loginResult?.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: error?.message || "Login failed",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Sign in to your account
        </h1>
        <p className="mt-2">
          Don't have an account
          <Link
            className="font-medium ml-2 text-primary hover:underline"
            to="/auth/register"
          >
            Register
          </Link>
        </p>
      </div>
      <CommonForm
        formControls={loginFormControls}
        buttonText={"Sign In"}
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
      />
    </div>
  );
}

export default AuthLogin;