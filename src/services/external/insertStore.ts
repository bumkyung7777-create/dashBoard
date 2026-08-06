// 한 행 또는 여러 행 insert
import axios from "axios";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY as string;
export async function insertTableData<T>(tableName: string, payload: T | T[]) {
  try {
    const response = await axios.post(
      `${supabaseUrl}/rest/v1/${tableName}`,
      payload,
      {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          "Content-Type": "application/json",
          // 삽입된 데이터를 응답으로 받고 싶으면 아래 Prefer 헤더 추가
          Prefer: "return=representation",
        },
      },
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Supabase 데이터 insert 실패:", error.response?.data);
    } else {
      console.error("Supabase 데이터 insert 실패:", error);
    }
    throw error;
  }
}
