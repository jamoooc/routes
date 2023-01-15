// fetch wrapper utility

export default async function fetchData<T>(url: string, init?: RequestInit): Promise<T> {
  return await fetch(url, init)
    .then((response) => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return response.json() as Promise<T>
    })
    .then((data) => data)
    .catch((e) => {
      throw e;
    });
}
