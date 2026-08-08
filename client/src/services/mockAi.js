// Phase 2 only: fake response so we can build/test the UI before the
// real Hugging Face pipeline exists (that's Phase 3+).
const MOCK_OUTPUT = `A small win for today 😊 I finally finished my DataCamp course and earned the certificate. It may be a small achievement, but I'm still happy that I was able to stay consistent and finish what I started. Still have a lot to learn, but I'm glad to see a little progress along the way.

One step at a time. 🙌`

export function fakeGenerate() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(MOCK_OUTPUT), 1200)
  })
}
