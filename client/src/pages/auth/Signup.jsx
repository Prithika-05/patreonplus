import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
Card,
CardContent,
CardDescription,
CardFooter,
CardHeader,
CardTitle,
} from "@/components/ui/card";

import {
Select,
SelectContent,
SelectItem,
SelectTrigger,
SelectValue,
} from "@/components/ui/select";

import {
User,
AtSign,
Mail,
Lock,
Sparkles,
Loader2,
ArrowRight,
CheckCircle2,
Circle,
} from "lucide-react";

import { signupSchema } from "@/validations/auth.schema";

const Requirement = ({ valid, text }) => (

  <div className="flex items-center gap-2 text-sm">
    {valid ? (
      <CheckCircle2 className="h-4 w-4 text-green-600" />
    ) : (
      <Circle className="h-4 w-4 text-gray-400" />
    )}

<span
  className={
    valid
      ? "text-green-600 font-medium"
      : "text-muted-foreground"
  }
>
  {text}
</span>

  </div>
);

const Signup = () => {
const [name, setName] = useState("");
const [username, setUsername] = useState("");
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [role, setRole] = useState("subscriber");

const [isLoading, setIsLoading] = useState(false);
const [errors, setErrors] = useState({});
const [serverError, setServerError] = useState("");

const { signup } = useAuth();
const navigate = useNavigate();

const passwordChecks = {
minLength: password.length >= 8,
uppercase: /[A-Z]/.test(password),
lowercase: /[a-z]/.test(password),
number: /[0-9]/.test(password),
special: /[^A-Za-z0-9]/.test(password),
};

const handleSubmit = async (e) => {
e.preventDefault();

setIsLoading(true);
setErrors({});
setServerError("");

const validation = signupSchema.safeParse({
  name,
  username,
  email,
  password,
  role,
});

if (!validation.success) {
  const fieldErrors = {};

  validation.error.issues.forEach((issue) => {
    fieldErrors[issue.path[0]] = issue.message;
  });

  setErrors(fieldErrors);
  setIsLoading(false);
  return;
}

try {
  await signup(
    name,
    username,
    email,
    password,
    role
  );

  navigate("/login", {
    state: {
      message:
        "Account created successfully! Please log in.",
    },
  });
} catch (err) {
  setServerError(
    err.message ||
      "Failed to create account. Please try again."
  );
} finally {
  setIsLoading(false);
}

};

return ( <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-background via-background to-violet-50/50 dark:to-violet-950/20 p-4"> <Card className="w-full max-w-md shadow-xl border-border/50 backdrop-blur-sm"> <CardHeader className="space-y-1 text-center"> <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary"> <Sparkles className="h-6 w-6" /> </div>

      <CardTitle className="text-2xl font-bold tracking-tight">
        Create Account
      </CardTitle>

      <CardDescription>
        Join Patreon+ and start your journey today
      </CardDescription>
    </CardHeader>

    <form onSubmit={handleSubmit}>
      <CardContent className="space-y-4">
        {serverError && (
          <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive text-center">
            {serverError}
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>

            <div className="relative">
              <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />

              <Input
                id="name"
                placeholder="John Doe"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                className="pl-9"
                disabled={isLoading}
              />
            </div>

            {errors.name && (
              <p className="text-sm text-destructive">
                {errors.name}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="username">
              Username
            </Label>

            <div className="relative">
              <AtSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />

              <Input
                id="username"
                placeholder="johndoe"
                value={username}
                onChange={(e) =>
                  setUsername(e.target.value)
                }
                className="pl-9"
                disabled={isLoading}
              />
            </div>

            {errors.username && (
              <p className="text-sm text-destructive">
                {errors.username}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">
            Email Address
          </Label>

          <div className="relative">
            <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />

            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              className="pl-9"
              disabled={isLoading}
            />
          </div>

          {errors.email && (
            <p className="text-sm text-destructive">
              {errors.email}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">
            Password
          </Label>

          <div className="relative">
            <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />

            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              className="pl-9"
              disabled={isLoading}
            />
          </div>

          <div className="rounded-md border p-3 space-y-2 bg-muted/30">
            <Requirement
              valid={passwordChecks.minLength}
              text="At least 8 characters"
            />

            <Requirement
              valid={passwordChecks.uppercase}
              text="One uppercase letter"
            />

            <Requirement
              valid={passwordChecks.lowercase}
              text="One lowercase letter"
            />

            <Requirement
              valid={passwordChecks.number}
              text="One number"
            />

            <Requirement
              valid={passwordChecks.special}
              text="One special character"
            />
          </div>

          {errors.password && (
            <p className="text-sm text-destructive">
              {errors.password}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="role">
            I want to join as a...
          </Label>

          <Select
            value={role}
            onValueChange={setRole}
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a role" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="subscriber">
                Subscriber
              </SelectItem>

              <SelectItem value="creator">
                Creator
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col space-y-4">
        <Button
          className="w-full group"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating Account...
            </>
          ) : (
            <>
              Sign Up
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </>
          )}
        </Button>

        <div className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <a
            href="/login"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            Log in
          </a>
        </div>
      </CardFooter>
    </form>
  </Card>
</div>

);
};

export default Signup;
