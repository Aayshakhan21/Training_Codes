package com.wipro.learning.core.strings;

public class ReplaceConsonants {

	public static String replace(String str) {
		String result = "";

		for (int i = 0; i < str.length(); i++) {
			char ch = str.charAt(i);

			if (Character.isLetter(ch) && ch != 'a' && ch != 'e' && ch != 'i' && ch != 'o' && ch != 'u' && ch != 'A'
					&& ch != 'E' && ch != 'I' && ch != 'O' && ch != 'U') {
				result = result + '0';
			} else {
				result = result + ch;
			}
		}

		return result;
	}

	public static void main(String[] args) {
		System.out.println(replace("Vishal"));  
		
		/*Output
		 * V -> 0 -> Consonant
		 * i -> Vowel
		 * s -> 0 -> Consonant
		 * h -> 0 -> Consonant
		 * a -> Vowel
		 * l -> 0 -> Consonant
		 */
		
	}
}