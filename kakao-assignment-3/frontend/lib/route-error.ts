import axios from "axios";
import { NextResponse } from "next/server";

export function createBadRequestResponse(message: string): NextResponse {
  return NextResponse.json({ message }, { status: 400 });
}

export function createRouteErrorResponse(error: unknown): NextResponse {
  if (axios.isAxiosError(error)) {
    return NextResponse.json(
      {
        message: error.response?.data?.detail ?? "API 요청에 실패했어요.",
      },
      {
        status: error.response?.status ?? 500,
      },
    );
  }

  return NextResponse.json(
    { message: "알 수 없는 오류가 발생했어요." },
    { status: 500 },
  );
}
