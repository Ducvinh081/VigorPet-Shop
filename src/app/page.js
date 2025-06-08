import Header from "@/components/layout/Header";
import Hero from "@/components/layout/Hero";
import HomeMenu from "@/components/layout/HomeMenu";
import SectionHeaders from "@/components/layout/SectionHeaders";
export default function Home() {
  return (
    <>
      <Hero />
      <HomeMenu />
      <section className="text-center my-16" id="about">
        <SectionHeaders subHeader={"Câu chuyện"} mainHeader={"về chúng tôi"} />
        <div className="text-gray-500 max-w-2xl mx-auto mt-4 flex flex-col gap-4 text-justify">
          <p>Vigor Pet Nha Trang là cửa hàng chuyên cung cấp các sản phẩm và dịch vụ dành cho thú cưng, 
            từ thức ăn, phụ kiện đến chăm sóc sức khỏe. Với không gian thân thiện và đội ngũ nhân viên nhiệt tình, 
            Vigor Pet mang đến những trải nghiệm tốt nhất cho thú cưng và chủ nuôi tại Nha Trang.
          </p>
        </div>
      </section>
      <section className="text-center my-8" id="contact">
        <SectionHeaders
          subHeader={""}
          mainHeader={"Đừng ngại liên hệ với chúng tôi"}
        />
        <div className="mt-8">
          <a className="text-4xl text-gray-500" href="tel:0967089107">
            0967089107
          </a>
        </div>
      </section>
    </>
  );
}
