// src/api/getSupabaseTable.ts
import axios from "axios";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY as string;

// 테이블 이름을 직접 넣어도 되고, 인자로 받아도 됩니다.
export async function getTableData(tableName: string) {
  try {
    const response = await axios.get(`${supabaseUrl}/rest/v1/${tableName}`, {
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
      },
      // 전체 데이터 가져오고 싶으면
      params: {
        select: "*",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Supabase 데이터 패칭 실패:", error);
    return [];
  }
}
