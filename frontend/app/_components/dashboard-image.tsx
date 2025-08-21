import Image from "next/image";
export const DashboardImage = () => {
  return (
    <>
      <div className="bg-muted/40 mt-20 h-auto w-full rounded-xl p-2 backdrop-blur-md">
        <div className="">
          <Image
            src={"/t3-dash.png"}
            width={2000}
            height={2000}
            className="rounded-xl"
            alt="dashboard image"
          />
        </div>
      </div>
    </>
  );
};
