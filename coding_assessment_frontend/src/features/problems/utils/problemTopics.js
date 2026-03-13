/**
 * Mapping of problem titles to topics (from problems_data.json).
 * Used for tag display when backend doesn't provide topic.
 */
export const PROBLEM_TOPICS = {
  "Hello World": "strings",
  "Sum of Two Numbers": "basic math",
  "Maximum in Array": "arrays",
  "Reverse a String": "strings",
  "Two Sum": "hash maps",
  "Factorial (Recursion)": "recursion",
  "Bubble Sort Count": "sorting",
  "Binary Search": "searching",
  "Valid Palindrome": "two pointers",
  "Max Sum Subarray of Size K": "sliding window",
  "Valid Parentheses": "stack",
  "Climbing Stairs": "dynamic programming",
  "Best Time to Buy and Sell Stock": "greedy",
  "Count Set Bits": "bit manipulation",
  "FizzBuzz": "basic math",
  "Contains Duplicate": "hash maps",
  "Move Zeros": "two pointers",
  "Longest Substring Without Repeating": "sliding window",
  "Merge Two Sorted Arrays": "arrays",
  "Group Anagrams": "hash maps",
  "Fibonacci (Memoization)": "recursion",
  "Kth Largest in Array": "sorting",
  "Search in Rotated Sorted Array": "searching",
  "Container With Most Water": "two pointers",
  "Minimize Maximum Subarray Sum": "binary search",
  "Evaluate Reverse Polish Notation": "stack",
  "Coin Change": "dynamic programming",
  "Jump Game": "greedy",
  "Power of Two": "bit manipulation",
  "GCD of Two Numbers": "basic math",
  "Longest Palindromic Substring": "strings",
  "Implement Queue using Stacks": "stack",
  "Longest Increasing Subsequence": "dynamic programming",
  "Single Number": "bit manipulation",
  "Two Sum II - Input Array Is Sorted": "two pointers",
  "LRU Cache": "hash maps",
  "Median of Two Sorted Arrays": "binary search",
  "Merge K Sorted Arrays": "heap",
  "Word Ladder": "graph",
  "Course Schedule": "graph",
  "Sliding Window Maximum": "sliding window",
  "Minimum Window Substring": "sliding window",
  "Trapping Rain Water": "two pointers",
  "3Sum": "two pointers",
  "N-Queens": "recursion",
  "Longest Valid Parentheses": "dynamic programming",
};

export const TOPIC_LABELS = {
  "arrays": "Arrays",
  "strings": "Strings",
  "hash maps": "Hash Map",
  "recursion": "Recursion",
  "sorting": "Sorting",
  "searching": "Searching",
  "two pointers": "Two Pointers",
  "sliding window": "Sliding Window",
  "stack": "Stack",
  "dynamic programming": "DP",
  "greedy": "Greedy",
  "basic math": "Math",
  "bit manipulation": "Bit Manipulation",
  "binary search": "Binary Search",
  "heap": "Heap",
  "graph": "Graph",
};

export function getTopicsForProblem(title) {
  const topic = PROBLEM_TOPICS[title];
  if (!topic) return [];
  return [TOPIC_LABELS[topic] || topic];
}
