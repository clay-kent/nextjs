"use client";
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import ValidationAlert from "@/app/_components/ValidationAlert";
import { supabase } from "@/utils/supabase";

const Page: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = useCallback(() => {
    let isValid = true;
    if (email.trim() === "") {
      setEmailError("メールアドレスを入力してください。");
      isValid = false;
    } else {
      setEmailError("");
    }
    if (password === "") {
      setPasswordError("パスワードを入力してください。");
      isValid = false;
    } else {
      setPasswordError("");
    }
    return isValid;
  }, [email, password]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    setLoginError("");
    setIsSubmitting(true);
    try {
      console.log("ログイン処理を実行します。");
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setLoginError(
          `ログインIDまたはパスワードが違います（${error.code}）。`
        );
        console.error(JSON.stringify(error, null, 2));
        return;
      }
      console.log("ログイン処理に成功しました。");
      router.replace("/admin");
    } catch (error) {
      setLoginError("ログイン処理中に予期せぬエラーが発生しました。");
      console.error(JSON.stringify(error, null, 2));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex justify-center">
      <div className="w-full max-w-[400px] px-4 py-8">
        <h2 className="mb-4 text-center text-2xl font-bold">ログイン</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <ValidationAlert msg={loginError} />
          </div>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="mb-1 inline-block font-bold text-gray-700"
            >
              <FontAwesomeIcon icon={faEnvelope} className="mr-1" />
              メールアドレス
            </label>
            <input
              type="email"
              id="email"
              className="w-full rounded border px-3 py-2 outline-none focus:border-sky-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
            />
            <ValidationAlert msg={emailError} />
          </div>
          <div className="mb-8">
            <label
              htmlFor="password"
              className="mb-1 inline-block font-bold text-gray-700"
            >
              <FontAwesomeIcon icon={faLock} className="mr-1" />
              パスワード
            </label>
            <input
              type="password"
              id="password"
              className="w-full rounded border px-3 py-2 outline-none focus:border-sky-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isSubmitting}
            />
            <ValidationAlert msg={passwordError} />
          </div>
          <button
            type="submit"
            className="w-full rounded bg-sky-500 py-2 font-bold text-white hover:bg-sky-600 disabled:bg-sky-200"
            disabled={isSubmitting}
          >
            ログイン
          </button>
        </form>
      </div>
    </main>
  );
};

export default Page;