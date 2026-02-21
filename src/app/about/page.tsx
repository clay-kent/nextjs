"use client";
import Image from "next/image";
import { twMerge } from "tailwind-merge";

const Page: React.FC = () => {
  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row items-center gap-10 mb-16">
        <div className="flex-shrink-0">
          <div className="p-1 rounded-full border-4 border-slate-400 bg-white shadow-lg">
            <Image
              src="/images/avatar.png"
              alt="Clay Kent"
              width={200}
              height={200}
              priority
              className="rounded-full object-cover"
            />
          </div>
        </div>
        <div className="text-center md:text-left">
          <h1 className="text-5xl font-extrabold mb-4 text-slate-900 tracking-tight">Clay Kent</h1>
          <p className="text-xl text-slate-600 mb-6 font-medium">
            大阪公立大学工業高等専門学校<br/>知能情報コース
          </p>
          <div className="flex justify-center md:justify-start gap-4">
            <a
              href="https://github.com/clay-kent"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all font-semibold shadow-md hover:shadow-lg active:scale-95"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>

      <div className="space-y-16">
        <section>
          <div className="flex items-center gap-4 mb-6">
            <h2 className="text-3xl font-bold text-slate-800">Profile</h2>
            <div className="h-0.5 flex-grow bg-slate-200"></div>
          </div>
          <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed text-lg">
            <p>
              小学生の頃からプログラミング、電子工作やUXデザイン、機械学習など<br/>
              技術のレイヤーを問わず「ものづくり」を追求。
            </p>
            <p className="mt-4">
              また、Minecraftコミュニティでも長年活動しており<br/>
              コマンド・Mod開発からサーバー運営までこなすマルチクリエイター。
            </p>
          </div>
        </section>

        <div className="grid md:grid-cols-2 gap-12">
          <section>
            <div className="flex items-center gap-4 mb-6">
              <h2 className="text-2xl font-bold text-slate-800">Languages</h2>
              <div className="h-0.5 flex-grow bg-slate-200"></div>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {["Java", "TypeScript", "Python"].map((lang) => (
                <span
                  key={lang}
                  className="px-4 py-2 bg-slate-100 text-slate-800 rounded-lg font-bold border border-slate-200 hover:bg-slate-50 transition-colors shadow-sm"
                >
                  {lang}
                </span>
              ))}
            </div>
          </section>

          <section>
            <div className="flex items-center gap-4 mb-6">
              <h2 className="text-2xl font-bold text-slate-800">Interests</h2>
              <div className="h-0.5 flex-grow bg-slate-200"></div>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {["認知科学", "哲学", "生成AI"].map((interest) => (
                <span
                  key={interest}
                  className="px-4 py-2 bg-slate-100 text-slate-800 rounded-lg font-bold border border-slate-200 hover:bg-slate-50 transition-colors shadow-sm"
                >
                  {interest}
                </span>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};

export default Page;
