"use client";

export default function TestPage() {
    return (
        <div>
            <a href="https://accounts.google.com/o/oauth2/v2/auth?redirect_uri=http://localhost:8080/login/oauth2/code/google&response_type=code&client_id=33710424976-45bosf06t43omkcl1gqc7n99tt80j16c.apps.googleusercontent.com&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile+openid&access_type=offline">
                Sign in with Google
            </a>
        </div>
    );
}   