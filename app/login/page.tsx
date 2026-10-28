import SignInBtn from "./_components/SignInBtn";

export default function LoginPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-4xl font-bold mb-8">Login</h1>
            <SignInBtn provider="google" />
        </div>
    );
}