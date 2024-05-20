use std::io;

fn compress(input: &str) -> String {
    let mut cyclic_permutations: Vec<String> = Vec::new();

    for i in 0..input.len() {
        let permutation = format!("{}{}", &input[i..], &input[..i]);
        cyclic_permutations.push(permutation);
    }

    cyclic_permutations.sort();

    let ans: String = cyclic_permutations.iter().map(|s| s.chars().last().unwrap()).collect();

    ans
}

fn decompress(data: &String) -> String{
    let mut stack: Vec<(String, usize)> = vec![("".to_string(), 0)];
    let ans = String::new();
    while let Some((prefix, length)) = stack.pop() {
        if length < data.len()+1 {
            if length > 1{
                if compress(&prefix) == *data{
                    return prefix;
                }
            }
            println!("{}", prefix);
            for c in b'!'..=b'}' {
                let mut new_prefix = prefix.clone();
                new_prefix.push(c as char);
                stack.push((new_prefix, length + 1));
            }
        }
    }
    ans
}
//sgtDST,_Csyueugddtwdtelh_eneherwwhetr___naittwft}__fe_uiiyyf_Nrwuerulieuian_,sooogboooo_{m__F!
fn main() {
    loop {
        println!("Enter encode or decode (or type 'exit' to quit):");

        let mut input = String::new();
        let mut input2 = String::new();
        io::stdin().read_line(&mut input)
            .expect("Failed to read line");

        let input = input.trim();

        if input.eq_ignore_ascii_case("exit") {
            println!("Exiting the loop...");
            break;
        }
        else if input.eq_ignore_ascii_case("encode") {
            println!("String to encode!");
            io::stdin().read_line(&mut input2)
                .expect("Failed to read line");
            let input2 = input2.trim();
            let compressed = compress(input2);
            println!("Original: {}", input2);
            println!("Encoded: {:?}", compressed);
        }
        else if input.eq_ignore_ascii_case("decode") {
            println!("String to decode!");
            io::stdin().read_line(&mut input2)
                .expect("Failed to read line");
            let input2 = input2.trim();
            let decompressed = decompress(&(input2.to_string()));
            println!("Original: {}", input2);
            println!("Decoded: {:?}", decompressed);
        }
        else {
            println!("please choose an option!");
        }

    }

}