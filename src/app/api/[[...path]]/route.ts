import { dispatchApiRequest } from "@/lib/api-handlers";

export const dynamic = "force-dynamic";

function getPathSegments(request: Request, params?: { path?: string[] }): string[] {
  if (params?.path && Array.isArray(params.path) && params.path.length > 0) {
    return params.path;
  }
  const url = new URL(request.url);
  const stripped = url.pathname.replace(/^\/api\/?/, "");
  if (!stripped) return [];
  return stripped.split("/").filter(Boolean);
}

export async function GET(
  request: Request,
  context: { params?: { path?: string[] } }
) {
  const params = context?.params ? await Promise.resolve(context.params) : {};
  const segments = getPathSegments(request, params);
  return dispatchApiRequest(request, segments);
}

export async function POST(
  request: Request,
  context: { params?: { path?: string[] } }
) {
  const params = context?.params ? await Promise.resolve(context.params) : {};
  const segments = getPathSegments(request, params);
  return dispatchApiRequest(request, segments);
}

export async function PUT(
  request: Request,
  context: { params?: { path?: string[] } }
) {
  const params = context?.params ? await Promise.resolve(context.params) : {};
  const segments = getPathSegments(request, params);
  return dispatchApiRequest(request, segments);
}

export async function DELETE(
  request: Request,
  context: { params?: { path?: string[] } }
) {
  const params = context?.params ? await Promise.resolve(context.params) : {};
  const segments = getPathSegments(request, params);
  return dispatchApiRequest(request, segments);
}

export async function OPTIONS(
  request: Request,
  context: { params?: { path?: string[] } }
) {
  const params = context?.params ? await Promise.resolve(context.params) : {};
  const segments = getPathSegments(request, params);
  return dispatchApiRequest(request, segments);
}
