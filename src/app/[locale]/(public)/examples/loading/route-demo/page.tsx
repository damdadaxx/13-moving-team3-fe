// [메뉴] 예시
// [페이지] 라우트 전환 로딩 데모

export default async function LoadingRouteDemoPage() {
  await new Promise((resolve) => {
    setTimeout(resolve, 2000);
  });

  return (
    <div className="mx-auto max-w-[720px] p-[24px]">
      <h1 className="text-xl-bold">라우트 전환 완료</h1>
      <p className="mt-2 text-md-regular text-gray-500">
        이 페이지로 오는 2초 동안{' '}
        <code>examples/loading/route-demo/loading.tsx</code>의 LoadingDisplay가
        보였습니다. 앱 라우트에는 <code>loading.tsx</code>가 없고, 각 페이지
        스켈레톤이 로딩 화면입니다.
      </p>
    </div>
  );
}
