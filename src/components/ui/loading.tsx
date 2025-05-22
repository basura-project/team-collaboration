import * as React from "react";
import Image from "next/image";

export default function Loading({ className, variant, ...props }: any) {
  let [unmount, setUnmountd] = React.useState<boolean>(false);
  let { loaded } = props;
  React.useEffect(() => {
    window.addEventListener("beforeunload", t);

    return () => {
      setTimeout(() => {
        window.removeEventListener("beforeunload", t);
        setUnmountd(true);
      }, 100);
    };
  }, []);

  function t() {
    setUnmountd(true);
  }

  return (
    <div className="loaderContainer">
      {!loaded && <div className="loader"></div>}
      <Image
        src="/logo-icon.svg"
        width={42}
        height={42}
        alt="Basura Logo"
        className="block dark:hidden"
        style={{
          position: "absolute",
          left: "calc(50% - 21px)",
          top: "calc(50% - 21px)",
          transition: "0.2s",
        }}
      />
    </div>
  );
}
