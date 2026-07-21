import json
import os
from PIL import Image, ImageDraw, ImageFont
import qrcode
import traceback
import argparse
import urllib.request
from io import BytesIO
import sys
from pathlib import Path

# Add tools directory to path for format_hook import
sys.path.insert(0, str(Path(__file__).parent.parent))
from format_hook import run_format_hook

# --- Path Configuration: NorthStar Academy Asset Management ---
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
LOGOS_SUBDIR = "Logos"
DEFAULT_LOGO_FILENAME = "nsa-star-logo.png"
DEFAULT_LOGO_PATH_ABSOLUTE = os.path.join(SCRIPT_DIR, LOGOS_SUBDIR, DEFAULT_LOGO_FILENAME)
MAIN_FONT_FILENAME = "Lexend-Regular.ttf"
MAIN_FONT_PATH_ABSOLUTE = os.path.join(SCRIPT_DIR, MAIN_FONT_FILENAME)

# NorthStar Academy Asset Server Configuration
NSA_ASSET_SERVER = "https://images.nsa-images.org/assets/branding/"
NSA_MOODLE_QR_URL = NSA_ASSET_SERVER + "NSA-Moodle_QR.png"
NSA_LOGO_URL = NSA_ASSET_SERVER + "nsa-star-logo.png"

# Standard QR code for all NSA Moodle content
NSA_MOODLE_URL = "https://nsa.myghsd.ca"

# Common image file extensions to try if the JSON name doesn't include one
COMMON_IMAGE_EXTENSIONS = ['.png', '.svg', '.jpg', '.jpeg', '.gif']

# NorthStar Academy brand colors
NSA_NAVY = "#00205B"
NSA_GOLD = "#FFD700"

def download_nsa_asset(url, fallback_path=None):
    """
    Download an asset from the NSA asset server with local fallback.
    Follows NorthStar Academy's asset management strategy.
    """
    try:
        with urllib.request.urlopen(url) as response:
            return Image.open(BytesIO(response.read())).convert('RGBA')
    except Exception as e:
        print(f"  - WARNING: Failed to download asset from {url}: {e}")
        if fallback_path and os.path.exists(fallback_path):
            print(f"  - INFO: Using local fallback: {fallback_path}")
            return Image.open(fallback_path).convert('RGBA')
        return None

def create_nsa_standard_qr():
    """
    Create the standardized NSA Moodle QR code for consistency across all materials.
    This generates the same QR code used in PDF book footers.
    """
    output_folder = os.path.join(SCRIPT_DIR, "..", "PBR", "PBR-6", "social", "json", "qr_codes")
    output_filename = "NSA-Moodle_QR.png"
    
    print("\n--- Creating Standardized NSA Moodle QR Code ---")
    print(f"URL: {NSA_MOODLE_URL}")
    print(f"Output: {os.path.join(output_folder, output_filename)}")
    
    # Create a clean, professional QR code for institutional use
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=10,
        border=4,
    )
    qr.add_data(NSA_MOODLE_URL)
    qr.make(fit=True)
    
    # Generate clean QR image
    qr_img = qr.make_image(fill_color=NSA_NAVY, back_color="white")
    
    # Ensure output directory exists
    os.makedirs(output_folder, exist_ok=True)
    
    # Save the standard QR code
    qr_img.save(os.path.join(output_folder, output_filename))
    print(f"  - Successfully created standardized NSA QR code: {output_filename}")
    
    return os.path.join(output_folder, output_filename)

def create_styled_qr_code(url, title, logo_path, font_path, output_filename, output_folder="output_qr_codes"):
    """
    Creates a single, custom-styled QR code image that automatically wraps long titles, 
    uses NorthStar Academy branding, and outputs a professional 175x175 image.
    
    Enhanced for NorthStar Academy standards:
    - Consistent 175px sizing for Moodle Book integration
    - NSA brand colors and typography
    - Asset server integration for logos
    - Optimized for print-first design philosophy
    """
    # --- NSA Style Configuration for 175x175 output ---
    output_size = 175
    background_color = (255, 255, 255, 0)  # Transparent background for Moodle
    padding = 10  # Padding around the entire content
    main_color = NSA_NAVY  # NorthStar Academy brand navy
    font_size = 12
    extra_line_padding = 2
    logo_padding = 4 # White padding around the logo

    # --- Create the base canvas ---
    final_img = Image.new('RGBA', (output_size, output_size), background_color)
    draw_final = ImageDraw.Draw(final_img)

    # --- Font and Text Calculation (Lexend for accessibility) ---
    try:
        if os.path.exists(font_path):
            font = ImageFont.truetype(font_path, font_size)
            print(f"  - INFO: Successfully loaded Lexend font from '{font_path}'")
        else:
            raise FileNotFoundError(f"Lexend font not found at '{font_path}'")
    except (IOError, OSError, FileNotFoundError) as e:
        print(f"  - WARNING: Font loading failed: {e}. Using default font.")
        try:
            font = ImageFont.load_default()
        except:
            font = ImageFont.load_default()

    # Wrap title text for readability
    lines, current_line = [], ""
    for word in title.split():
        # Check width against the content area inside the padding
        if font.getbbox(current_line + word)[2] < (output_size - 2 * padding):
            current_line += word + " "
        else:
            lines.append(current_line.strip())
            current_line = word + " "
    lines.append(current_line.strip())

    # Calculate total height needed for the text
    if hasattr(font, 'getbbox'):
        bbox = font.getbbox("A")
        line_height = bbox[3] - bbox[1]
    else: # Fallback for older Pillow versions
        _, line_height = font.getsize("A")
    total_text_height = len(lines) * (line_height + extra_line_padding)

    # --- QR Code Generation with NSA branding ---
    qr_area_size = output_size - (2 * padding) - total_text_height - 5 # 5px margin between QR and text
    
    qr = qrcode.QRCode(error_correction=qrcode.constants.ERROR_CORRECT_H, box_size=10, border=1)
    qr.add_data(url)
    qr.make(fit=True)
    
    # Create QR image with NSA brand colors
    qr_img_raw = qr.make_image(fill_color=main_color, back_color="white").convert('RGBA')
    qr_img_scaled = qr_img_raw.resize((qr_area_size, qr_area_size), Image.LANCZOS)

    # Paste the scaled QR code onto the canvas
    qr_pos_x = (output_size - qr_area_size) // 2
    qr_pos_y = padding
    final_img.paste(qr_img_scaled, (qr_pos_x, qr_pos_y))

    # --- Add the Logo with NSA Asset Server Integration ---
    logo_img = None
    
    # Try NSA asset server first, then specific path, then local fallback
    if logo_path and os.path.exists(logo_path):
        try:
            logo_img = Image.open(logo_path).convert('RGBA')
            print(f"  - INFO: Successfully loaded specific logo: '{logo_path}'")
        except Exception as e:
            print(f"  - WARNING: Failed to load specific logo: {e}")
    
    # Fallback to NSA asset server logo
    if not logo_img:
        print(f"  - INFO: Attempting to download NSA logo from asset server...")
        logo_img = download_nsa_asset(NSA_LOGO_URL, DEFAULT_LOGO_PATH_ABSOLUTE)
    
    # Final fallback to local default
    if not logo_img and os.path.exists(DEFAULT_LOGO_PATH_ABSOLUTE):
        try:
            logo_img = Image.open(DEFAULT_LOGO_PATH_ABSOLUTE).convert('RGBA')
            print(f"  - INFO: Using local default logo: '{DEFAULT_LOGO_PATH_ABSOLUTE}'")
        except Exception as e:
            print(f"  - WARNING: Failed to load default logo: {e}")

    if logo_img:
        logo_max_size = qr_area_size // 4
        logo_img.thumbnail((logo_max_size, logo_max_size), Image.LANCZOS)
        
        # Create a white background for the logo for better visibility
        logo_bg_size = (logo_img.width + logo_padding * 2, logo_img.height + logo_padding * 2)
        logo_bg = Image.new('RGBA', logo_bg_size, 'white')
        
        # Center the logo and its background on the QR code
        logo_bg_pos_x = (output_size - logo_bg.width) // 2
        logo_bg_pos_y = qr_pos_y + (qr_area_size - logo_bg.height) // 2
        final_img.paste(logo_bg, (logo_bg_pos_x, logo_bg_pos_y), logo_bg)

        logo_pos_x = (output_size - logo_img.width) // 2
        logo_pos_y = qr_pos_y + (qr_area_size - logo_img.height) // 2
        final_img.paste(logo_img, (logo_pos_x, logo_pos_y), logo_img)
    else:
        print(f"  - WARNING: No logo available for QR code")

    # --- Draw Title Text with NSA styling ---
    current_y = qr_pos_y + qr_area_size + 5  # Start drawing text below the QR code
    for line in lines:
        if hasattr(font, 'getbbox'):
            line_width = font.getbbox(line)[2] - font.getbbox(line)[0]
        else:
            line_width, _ = font.getsize(line)
        
        text_pos_x = (output_size - line_width) // 2
        draw_final.text((text_pos_x, current_y), line, font=font, fill=main_color)
        current_y += line_height + extra_line_padding

    # --- Save the final image ---
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)
        print(f"  - Created output directory: {output_folder}")
    
    output_path = os.path.join(output_folder, output_filename)
    final_img.save(output_path)
    print(f"  - Successfully created {output_filename} in {output_folder}")
    
    return output_path

def find_logo_with_extension(base_dir, logo_base_name):
    """
    Tries to find the logo file by appending common extensions if no extension is provided.
    Returns the full path if found, otherwise None.
    
    Enhanced for NorthStar Academy asset management standards.
    """
    if not logo_base_name:
        return None

    # Check if the logo_base_name already has an extension
    base, ext = os.path.splitext(logo_base_name)
    if ext.lower() in COMMON_IMAGE_EXTENSIONS:
        potential_path = os.path.join(base_dir, logo_base_name)
        if os.path.exists(potential_path):
            return potential_path
        else: # JSON had an extension, but that file doesn't exist
            return None # Don't try other extensions if one was specified and not found

    # If no extension, try common ones
    for ext_to_try in COMMON_IMAGE_EXTENSIONS:
        potential_path = os.path.join(base_dir, logo_base_name + ext_to_try)
        if os.path.exists(potential_path):
            return potential_path
    return None # Not found with any common extension

def main():
    print(f"""--- NorthStar Academy QR Code Generator ---""")
    print(f"Script directory: {SCRIPT_DIR}")
    print(f"NSA Asset Server: {NSA_ASSET_SERVER}")
    print(f"Standard Moodle URL: {NSA_MOODLE_URL}")
    print(f"Expected default logo: '{DEFAULT_LOGO_FILENAME}' in {LOGOS_SUBDIR}/")
    print(f"Expected font: '{MAIN_FONT_FILENAME}' (Lexend for accessibility)")
    print(f"Output format: 175x175px (optimized for Moodle Books)")
    print(f"------------------------------------------")

    # Option to create standardized NSA QR code
    create_standard = input("\nCreate standardized NSA Moodle QR code? (y/n): ").strip().lower()
    if create_standard in ['y', 'yes']:
        standard_qr_path = create_nsa_standard_qr()
        print(f"Standardized QR code created at: {standard_qr_path}")
        print("This QR code is ready for use in PDF book footers and Moodle content.")

    try:
        json_file_path_input = input(r"Enter the full path to the JSON file (or press Enter to skip custom QR generation): ").strip()

        if not json_file_path_input:
            print("\n[INFO] No JSON file provided. Exiting custom QR generation.")
            return
        elif not os.path.isfile(json_file_path_input):
            print(f"\n[ERROR] The JSON file '{json_file_path_input}' does not exist. Please check the path.")
            return
        else:
            json_file_path = json_file_path_input
            json_directory = os.path.dirname(json_file_path)
            output_destination_folder = os.path.join(json_directory, "qr_codes")
            project_logos_dir_path = os.path.join(SCRIPT_DIR, LOGOS_SUBDIR)
            main_font_path = MAIN_FONT_PATH_ABSOLUTE

            print(f"\n--- Pre-run File Checks (NorthStar Academy Standards) ---")
            if not os.path.exists(main_font_path):
                 print(f"[WARNING] Lexend font NOT FOUND at: '{main_font_path}'")
                 print(f"          Font is important for accessibility compliance")
            else:
                 print(f"[OK] Lexend font found at: '{main_font_path}'")

            if not os.path.exists(project_logos_dir_path):
                 print(f"[WARNING] Logos directory NOT FOUND at: '{project_logos_dir_path}'")
                 print(f"          Will attempt to use NSA asset server fallback")
            else:
                 print(f"[OK] Logos directory found at: '{project_logos_dir_path}'")

            if not os.path.exists(DEFAULT_LOGO_PATH_ABSOLUTE):
                print(f"[WARNING] Default logo NOT FOUND at: '{DEFAULT_LOGO_PATH_ABSOLUTE}'")
                print(f"          Will attempt to download from NSA asset server")
            else:
                print(f"[OK] Default logo found at: '{DEFAULT_LOGO_PATH_ABSOLUTE}'")
            print(f"--------------------------------------------------------")

            print(f"\n--- Running Pre-Processing Hook ---")
            # Run format hook on the JSON directory and output directory
            json_directory = os.path.dirname(json_file_path)
            run_format_hook(json_directory, ["**/*.json"])
            if os.path.exists(output_destination_folder):
                run_format_hook(output_destination_folder, ["**/*.html"])
            
            print(f"\n--- Starting Custom QR Code Generation ---")
            print(f"Reading JSON from: '{json_file_path}'")
            print(f"Logos sourced from: '{project_logos_dir_path}' (with NSA asset server fallback)")
            print(f"Output destination: '{output_destination_folder}'")

            with open(json_file_path, "r", encoding="utf-8-sig") as f:
                data = json.load(f)
                if not isinstance(data, list):
                    print(f"\n[ERROR] JSON file must contain an array of QR code objects.")
                    print(f"Expected format: [{{\"url\": \"...\", \"title\": \"...\", \"logo_name\": \"...\", \"filename\": \"...\"}}]")
                else:
                    if not data:
                        print(f"\n[INFO] JSON file contains an empty array.")
                    else:
                        required_keys = ['url', 'title', 'logo_name', 'filename']
                        
                        for i, item in enumerate(data, 1):
                            print(f"\nProcessing item {i} (NorthStar Academy format):")
                            try:
                                if not isinstance(item, dict):
                                    print(f"  - [WARNING] Item {i} is not a dictionary. Skipping.")
                                    continue

                                missing_keys = [key for key in required_keys if key not in item]
                                if missing_keys:
                                    print(f"  - [WARNING] Item {i} missing keys: {', '.join(missing_keys)}. Skipping.")
                                    continue

                                url = item.get('url', '').strip()
                                title = item.get('title', '').strip()
                                logo_base_name_from_json = item.get('logo_name', '').strip() 
                                output_filename = item.get('filename', '').strip()

                                if not all([url, title, output_filename]):
                                    print(f"  - [WARNING] Item {i} missing essential data. Skipping.")
                                    continue
                                
                                resolved_logo_path = None
                                if logo_base_name_from_json:
                                    resolved_logo_path = find_logo_with_extension(project_logos_dir_path, logo_base_name_from_json)
                                
                                print(f"  - URL: {url}")
                                print(f"  - Title: {title}")
                                print(f"  - Logo: '{logo_base_name_from_json}' -> {resolved_logo_path or 'NSA Asset Server Fallback'}")
                                print(f"  - Output: {output_filename}")

                                create_styled_qr_code(
                                    url=url,
                                    title=title,
                                    logo_path=resolved_logo_path,
                                    font_path=main_font_path, 
                                    output_filename=output_filename,
                                    output_folder=output_destination_folder
                                )
                            except Exception as e_row:
                                print(f"  - [ERROR] Failed to process item {i}: {e_row}")
                                traceback.print_exc() 

            print("\n--- Custom QR Code Generation Complete ---")
            print("All QR codes are 175x175px and ready for Moodle Book integration")

    except FileNotFoundError: 
        print(f"\n[ERROR] JSON file not found: '{json_file_path_input if 'json_file_path_input' in locals() else 'N/A'}'")
    except json.JSONDecodeError as e_json:
        print(f"\n[ERROR] Invalid JSON format: {e_json}")
        print("Please ensure the JSON follows NorthStar Academy standards")
    except Exception as e_main:
        print(f"\n[ERROR] Unexpected error: {e_main}")
        traceback.print_exc()

if __name__ == "__main__":
    main()
