const BOILERPLATES = {
  python: `def solve():
    pass

if __name__ == "__main__":
    solve()
`,
  java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Write your solution here
        sc.close();
    }
}
`,
  cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    return 0;
}
`,
  javascript: `function solve(input) {
  // Write your solution here
}

const fs = require("fs");
const input = fs.readFileSync(0, "utf8").trim();
solve(input);
`
};

export function getBoilerplate(slug) {
  return BOILERPLATES[slug] || "";
}

export default BOILERPLATES;
