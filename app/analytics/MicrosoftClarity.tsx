"use client";

import Script from "next/script";

const MicrosoftClarity = () => {
  return (
    // <>
    //   {" "}
    //   <Script type="text/javascript" src="/js/clarity.js" async />
    //   <Script
    //     dangerouslySetInnerHTML={{
    //       __html: `
    //   window.clarity=window.clarity||function(){(window.clarity.q=window.clarity.q||[]).push(arguments)};
    //   clarity("start", { projectId: "phf71ncedc" });
    // `,
    //     }}
    //   />
    // </>
    <>
      {" "}
      <Script
        id="microsoft-clarity-init"
        strategy="lazyOnload"
        dangerouslySetInnerHTML={{
          __html: `
      if ('requestIdleCallback' in window) {
        requestIdleCallback(function () {
          (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "${process.env.NEXT_PUBLIC_MICROSOFT_CLARITY}");
        });
      } else {
        // fallback if requestIdleCallback is not supported
        setTimeout(function () {
          (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "${process.env.NEXT_PUBLIC_MICROSOFT_CLARITY}");
        }, 3000);
      }
    `,
        }}
      />
    </>
  );
};

export default MicrosoftClarity;
