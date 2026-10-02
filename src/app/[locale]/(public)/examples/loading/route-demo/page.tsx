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
        보였습니다. 실제 앱에서는 <code>src/app/loading.tsx</code>가 같은 역할을
        합니다.
      </p>
    </div>
  );
}
