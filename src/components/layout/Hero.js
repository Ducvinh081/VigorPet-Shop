import Right from "@/components/icons/Right";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="hero md:mt-4">
      <div className="py-8 md:py-12">
        <h1 className="text-4xl font-semibold">
          Mọi thứ
          <br />
          đều tuyệt vời khi
          <br />
          ở bên&nbsp;
          <span className="text-primary">Thú cưng</span>
        </h1>
        <p className="my-6 text-gray-500 text-sm">
          Khám phá nhưng thức ăn và dụng cụ hằng ngày cho mèo và chó.
        </p>
        <div className="flex gap-4 text-sm">
          <button className="justify-center uppercase items-center bg-primary gap-2 text-white px-4 py-2 rounded-full">
            <a href="/menu">MUA SẮM NGAY!</a>
            <Right />
          </button>

          <button className="flex items-center border-0 gap-2 py-2 text-gray-600 font-semibold">
            <a href="#about">
            Tìm hiểu thêm
            </a>
            <Right />
          </button>
        </div>
      </div>
      <div className="relative hidden md:block">
        <Image
          src={"/landing-pet.png"}
          alt="Pet Banner"
          width={1200}
          height={400}

        />
      </div>
    </section>
  );
}

