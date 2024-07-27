import HeaderBox from "@/components/HeaderBox";
import TotalBalanceBox from "@/components/TotalBalanceBox";

const Home = () => {
  const loggedIn = { firstName: "VienNguyen" };
  return (
    <section className="home">
      <div className="home-content">
        <header className="home-header">
          <HeaderBox type="greeting" title="Wellcome" user={loggedIn?.firstName || "Guest"} subtext="Access & manage your account and transactions efficiently." />

          <TotalBalanceBox accounts={[]} totalBanks={1} totalCurrentBalance={1250.35} />
        </header>
      </div>
    </section>
  );
};

export default Home;
